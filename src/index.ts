import { Telegraf } from "telegraf";
import {
  ConnectorClient,
  NodeWebSocket,
  createLogger,
} from "@radixdlt/radix-connect-webrtc";
import { RadixNetwork } from "@radixdlt/radix-dapp-toolkit";

import { Rola, SignedChallenge } from "@radixdlt/rola";
import { webcrypto } from "node:crypto";
import { filter, tap, first } from "rxjs/operators";
import { config } from "./config";
import { secureRandom } from "./secure-random";
import { ResultAsync } from "neverthrow";
// Types
interface UserData {
  chatId: number;
  walletAddress?: string;
  lastAuthenticated?: Date;
  lastBalanceCheck?: Date;
  currentRole?: string;
  groupMemberships: Set<number>; // Set of group chat IDs
}

interface BotConfig {
  minBalance: number;
  authenticationTimeout: number;
  balanceCheckInterval: number; // How often to check balances
  roles: {
    whale: number;
    dolphin: number;
    fish: number;
  };
}
// Bot configuration
const botConfig: BotConfig = {
  minBalance: 100,
  authenticationTimeout: 24 * 60 * 60 * 1000, // 24 hours
  balanceCheckInterval: 60 * 60 * 1000, // 1 hour
  roles: {
    whale: 10000,
    dolphin: 1000,
    fish: 100,
  },
};

// Initialize bot and connector
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || "");
const logger = createLogger(1);

// Store user data in memory (replace with database in production)
const users = new Map<number, UserData>();
// Store group data
const managedGroups = new Set<number>();

// A simple in-memory store for challenges. A database should be used in production.
const ChallengeStore = () => {
  const challenges = new Map<string, { expires: number }>();

  const create = () => {
    const challenge = secureRandom(32); // 32 random bytes as hex string
    const expires = Date.now() + 1000 * 60 * 5; // expires in 5 minutes
    challenges.set(challenge, { expires }); // store challenge with expiration

    return challenge;
  };

  const verify = (input: string) => {
    const challenge = challenges.get(input);

    if (!challenge) return false;

    challenges.delete(input); // remove challenge after it has been used
    const isValid = challenge.expires > Date.now(); // check if challenge has expired

    return isValid;
  };

  return { create, verify };
};

const challengeStore = ChallengeStore();

// Initialize Rola
const { verifySignedChallenge } = Rola({
  networkId: RadixNetwork.Mainnet,
  applicationName: "Gumball Club",
  dAppDefinitionAddress:
    "account_tdx_e_128uml7z6mqqqtm035t83alawc3jkvap9sxavecs35ud3ct20jxxuhl",
  expectedOrigin:
    "https://radix-dapp-toolkit-dev.rdx-works-main.extratools.works",
});

// Mock function to get XRD balance (replace with actual gateway query)
const getXRDBalance = async (address: string): Promise<number> => {
  // TODO: Implement actual gateway query
  return Math.random() * 10000;
};

// Helper function to determine role based on balance
const getRoleForBalance = (balance: number): string => {
  if (balance >= botConfig.roles.whale) return "Whale 🐋";
  if (balance >= botConfig.roles.dolphin) return "Dolphin 🐬";
  if (balance >= botConfig.roles.fish) return "Fish 🐟";
  return "Minnow 🐠";
};

// Helper to check if user needs to re-authenticate
const needsReauth = (userData: UserData): boolean => {
  if (!userData.lastAuthenticated) return true;
  const timeSinceAuth = Date.now() - userData.lastAuthenticated.getTime();
  return timeSinceAuth > botConfig.authenticationTimeout;
};

// Group management functions
const addUserToGroup = async (chatId: number, groupId: number) => {
  const userData = users.get(chatId);
  if (userData) {
    userData.groupMemberships.add(groupId);
    users.set(chatId, userData);
  }
};

const removeUserFromGroup = async (chatId: number, groupId: number) => {
  const userData = users.get(chatId);
  if (userData) {
    userData.groupMemberships.delete(groupId);
    users.set(chatId, userData);

    try {
      await bot.telegram.banChatMember(groupId, chatId);
      await bot.telegram.unbanChatMember(groupId, chatId); // Immediately unban to allow rejoin
      await bot.telegram.sendMessage(
        chatId,
        `You've been removed from the group due to insufficient balance. ` +
          `Minimum required: ${botConfig.roles.fish} XRD`
      );
    } catch (error) {
      console.error(
        `Failed to remove user ${chatId} from group ${groupId}:`,
        error
      );
    }
  }
};

// Balance checking function
const checkAndUpdateUserBalance = async (chatId: number): Promise<void> => {
  const userData = users.get(chatId);
  if (!userData?.walletAddress) return;

  try {
    const balance = await getXRDBalance(userData.walletAddress);
    const newRole = getRoleForBalance(balance);

    // Update user data
    userData.lastBalanceCheck = new Date();
    userData.currentRole = newRole;
    users.set(chatId, userData);

    // Check if balance is below minimum for each group
    if (balance < botConfig.roles.fish) {
      for (const groupId of userData.groupMemberships) {
        await removeUserFromGroup(chatId, groupId);
      }

      await bot.telegram.sendMessage(
        chatId,
        `⚠️ Your balance (${balance.toFixed(
          2
        )} XRD) has fallen below the minimum requirement. ` +
          `You've been removed from groups requiring minimum balance.`
      );
    }
  } catch (error) {
    console.error(`Failed to check balance for user ${chatId}:`, error);
  }
};

// Periodic balance checking
const startPeriodicBalanceChecks = () => {
  setInterval(async () => {
    console.log("Starting periodic balance check...");
    for (const [chatId, userData] of users.entries()) {
      if (userData.walletAddress && userData.groupMemberships.size > 0) {
        await checkAndUpdateUserBalance(chatId);
      }
    }
  }, botConfig.balanceCheckInterval);
};

// Bot commands
bot.command("start", async (ctx) => {
  const chatId = ctx.chat.id;
  users.set(chatId, {
    chatId,
    groupMemberships: new Set(),
  });

  await ctx.reply(
    "Welcome to the Radix Wallet Bot! 🚀\n" +
      "Use /connect to authenticate with your Radix wallet."
  );
});

// Admin command to register a group for balance monitoring
bot.command("register_group", async (ctx) => {
  if (ctx.chat.type !== "group" && ctx.chat.type !== "supergroup") {
    await ctx.reply("This command can only be used in groups.");
    return;
  }

  const groupId = ctx.chat.id;
  const adminMembers = await ctx.getChatAdministrators();
  const isAdmin = adminMembers.some(
    (member) => member.user.id === ctx.from?.id
  );

  if (!isAdmin) {
    await ctx.reply("Only group administrators can use this command.");
    return;
  }

  managedGroups.add(groupId);
  await ctx.reply(
    "✅ Group registered for balance monitoring.\n" +
      `Minimum balance requirement: ${botConfig.roles.fish} XRD`
  );
});

// Connect command - initiates wallet connection
bot.command("connect", async (ctx) => {
  const chatId = ctx.chat.id;

  const connectorClient = ConnectorClient({
    isInitiator: true,
    target: "wallet",
    source: "extension",
    dependencies: { WebSocket: NodeWebSocket() },
    logger,
  });

  connectorClient.setConnectionConfig(config.connectorClient);
  connectorClient.connect();

  // Generate challenge for ROLA authentication
  const challenge = challengeStore.create();

  connectorClient.generateConnectionPassword().map(async (password) => {
    const passwordHex = password.toString("hex");

    await ctx.reply(
      "Please scan this code with your Radix wallet to connect:\n" +
        `Password: ${passwordHex}`
    );

    connectorClient.setConnectionPassword(password);
  });

  connectorClient.connected$
    .pipe(
      filter((status) => status),
      tap(() => {
        connectorClient.sendMessage({
          interactionId: webcrypto.randomUUID(),
          metadata: {
            version: 2,
            networkId: 2,
            dAppDefinitionAddress:
              "account_tdx_2_12yf9gd53yfep7a669fv2t3wm7nz9zeezwd04n02a433ker8vza6rhe",
            origin: "https://your-domain.com",
          },
          items: {
            discriminator: "authorizedRequest",
            auth: {
              discriminator: "challenge",
              challenge: challenge,
            },
            ongoingAccounts: {
              numberOfAccounts: {
                quantifier: "exactly",
                quantity: 1,
              },
            },
          },
        });
      }),
      first()
    )
    .subscribe();

  connectorClient.onMessage$.pipe(first()).subscribe(async (message) => {
    const signedChallenge: SignedChallenge = {
      challenge: message.items.auth.challenge,
      proof: message.items.auth.proof,
      address: message.items.accounts[0],
      type: "persona",
    };

    const isAuthenticated = await challengeStore.verify(
      signedChallenge.challenge
    );

    if (!isAuthenticated) {
      await ctx.reply("❌ Authentication failed. Please try again.");
      connectorClient.destroy();
      return;
    }

    const result = await verifySignedChallenge(signedChallenge);

    const userData = users.get(chatId) || {
      chatId,
      groupMemberships: new Set(),
    };

    userData.walletAddress = message.items.accounts[0];
    userData.lastAuthenticated = new Date();
    users.set(chatId, userData);

    const balance = await getXRDBalance(userData.walletAddress!);
    const role = getRoleForBalance(balance);
    userData.currentRole = role;

    await ctx.reply(
      `✅ Successfully connected wallet!\n` +
        `Address: ${userData.walletAddress}\n` +
        `Balance: ${balance.toFixed(2)} XRD\n` +
        `Role: ${role}\n\n` +
        `Use /balance to check your balance anytime.`
    );

    if (balance < botConfig.roles.fish) {
      await ctx.reply(
        `⚠️ Warning: Your balance is below the minimum requirement of ${botConfig.roles.fish} XRD ` +
          `required for group participation.`
      );
    }

    connectorClient.destroy();
  });
});

// Balance command
bot.command("balance", async (ctx) => {
  const chatId = ctx.chat.id;
  const userData = users.get(chatId);

  if (!userData?.walletAddress) {
    await ctx.reply("Please connect your wallet first using /connect");
    return;
  }

  if (needsReauth(userData)) {
    await ctx.reply(
      "Your session has expired. Please reconnect your wallet using /connect"
    );
    return;
  }

  const balance = await getXRDBalance(userData.walletAddress);
  const role = getRoleForBalance(balance);

  await ctx.reply(
    `💰 Current Balance: ${balance.toFixed(2)} XRD\n` + `🏷️ Role: ${role}`
  );

  if (balance < botConfig.roles.fish) {
    await ctx.reply(
      `⚠️ Warning: Your balance is below the minimum requirement for group participation.`
    );
  }
});

// Handle new chat members
bot.on("new_chat_members", async (ctx) => {
  const groupId = ctx.chat.id;

  // Only process if this is a managed group
  if (!managedGroups.has(groupId)) return;

  for (const newMember of ctx.message.new_chat_members) {
    const userData = users.get(newMember.id);

    if (!userData?.walletAddress) {
      await ctx.reply(
        `Welcome @${newMember.username}! Please use /connect in a private chat with me ` +
          `to verify your wallet balance before participating in this group.`
      );
      await removeUserFromGroup(newMember.id, groupId);
    } else {
      // Add group to user's memberships
      await addUserToGroup(newMember.id, groupId);

      // Check balance immediately
      await checkAndUpdateUserBalance(newMember.id);
    }
  }
});

// Help command
bot.command("help", async (ctx) => {
  const isGroup = ctx.chat.type === "group" || ctx.chat.type === "supergroup";

  let helpMessage =
    "🤖 Available Commands:\n\n" +
    "/start - Start the bot\n" +
    "/connect - Connect your Radix wallet\n" +
    "/balance - Check your current balance and role\n" +
    "/help - Show this help message";

  if (isGroup) {
    helpMessage +=
      "\n\nAdmin Commands:\n" +
      "/register_group - Register this group for balance monitoring";
  }

  await ctx.reply(helpMessage);
});

// Start the bot and periodic checks
bot
  .launch()
  .then(() => {
    console.log("Bot is running!");
    startPeriodicBalanceChecks();
  })
  .catch((error) => {
    console.error("Failed to start bot:", error);
  });

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
