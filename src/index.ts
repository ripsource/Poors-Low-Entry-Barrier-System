import { Telegraf, Context } from "telegraf";

import { v4 as uuidv4 } from "uuid";
import { Message } from "telegraf/types";
import { config } from "dotenv";

// Initialize Supabase client
import { supabase } from "./supabase";
import express from "express";

config();

const app = express();
const port = Number(process.env.PORT) || 8080;

// Add a health check endpoint
app.get("/", (req: any, res: any) => {
  res.send("Bot is running!");
});

const bot = new Telegraf(process.env.BOT_TOKEN!);
const VERIFICATION_URL = "https://plebs.netlify.app";
const GROUP_ID = "-1002317010886"; // Replace with your group's ID

// Middleware to check if command is from private chat
const privateChat = async (ctx: Context, next: () => Promise<void>) => {
  if (ctx.chat?.type === "private") {
    return next();
  }
  // Optionally delete command message from group
  if (ctx.message && "delete_message" in ctx.telegram) {
    await ctx.deleteMessage(ctx.message.message_id).catch(console.error);
  }
};

// Helper to create verification link
async function createVerificationLink(tgId: string): Promise<string> {
  // Check for existing unverified link
  const { data: existingLink } = await supabase
    .from("verification_links")
    .select("verification_uuid")
    .eq("tg_uid", tgId)
    .eq("verified", false)
    .single();

  if (existingLink?.verification_uuid) {
    return existingLink.verification_uuid;
  }

  // If no existing link, create new one
  const uniqueId = uuidv4();

  const { error } = await supabase.from("verification_links").insert([
    {
      tg_uid: tgId,
      verification_uuid: uniqueId,
    },
  ]);

  if (error) {
    console.error("Error creating verification link:", error);
    throw new Error("Failed to create verification link");
  }

  return uniqueId;
}

// Function to refresh all member flairs
async function refreshAllMemberFlairs() {
  try {
    // Get all chat members
    const members = await bot.telegram.getChatAdministrators(GROUP_ID);

    for (const member of members) {
      const userId = member.user.id.toString();
      const tag = await getUserTag(userId);

      if (tag) {
        await bot.telegram
          .setChatAdministratorCustomTitle(GROUP_ID, member.user.id, tag)
          .catch(console.error);
      }
    }
  } catch (error) {
    console.error("Error refreshing member flairs:", error);
  }
}

// Command to refresh flairs (admin only)
bot.command("refresh_flairs", async (ctx) => {
  // Check if user is admin
  const admins = await ctx.getChatAdministrators();
  const isAdmin = admins.some((admin) => admin.user.id === ctx.from?.id);

  if (!isAdmin) {
    return;
  }

  await refreshAllMemberFlairs();
  await ctx.reply("All member flairs have been refreshed.");
});

// Add session handling
bot.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error("Error in middleware:", err);
    await ctx.reply("An error occurred");
  }
});

// Modified isUserVerified helper
async function isUserVerified(tgId: string): Promise<boolean> {
  // First check verification_links table
  const { data: verificationData, error: verificationError } = await supabase
    .from("verification_links")
    .select("verification_uuid")
    .eq("tg_uid", tgId)
    .eq("verified", false)
    .single();

  console.log(verificationData, verificationError);

  if (!verificationData || verificationError) {
    return false;
  }

  // Then check tg_links table for complete verification
  const { data: linkData, error: linkError } = await supabase
    .from("tg_links")
    .select("*")
    .eq("tg_uid", verificationData?.verification_uuid)
    .single();

  return Boolean(linkData && !linkError);
}

bot.on("message", async (ctx) => {
  if (ctx.chat.id.toString() !== GROUP_ID) return;

  const userId = ctx.from.id.toString();
  const tag = await getUserTag(userId);

  if (tag) {
    const reply = await ctx.reply(`【${tag}】`, {
      reply_parameters: {
        message_id: ctx.message.message_id,
      },
    });

    // Delete after a few seconds to avoid clutter
    setTimeout(() => {
      ctx.deleteMessage(reply.message_id).catch(console.error);
    }, 3000);
  }
});

// Function to get all chat members
async function getAllChatMembers(ctx: Context) {
  try {
    const { data, error } = await supabase.from("tg_links").select("tg_uid");

    return data!.map((row) => row.tg_uid);
  } catch (error) {
    console.error("Error getting chat members:", error);
    return [];
  }
}

// Helper to get user's tag
async function getUserTag(tgId: string): Promise<string | null> {
  const { data: verificationData, error: verificationError } = await supabase
    .from("verification_links")
    .select("verification_uuid")
    .eq("tg_uid", tgId)
    .eq("verified", false)
    .single();

  const { data, error } = await supabase
    .from("tg_links")
    .select("tag")
    .eq("tg_uid", verificationData?.verification_uuid)
    .single();

  if (error || !data) return null;
  return data.tag;
}

// Modified start command - only works in private
bot.command("start", privateChat, async (ctx) => {
  const userId = ctx.from.id.toString();
  try {
    const uniqueId = await createVerificationLink(userId);
    const verificationLink = `${VERIFICATION_URL}/${uniqueId}`;

    await ctx.reply(
      `Welcome! To access the group chat, you'll need to verify your Radix wallet.\n\n` +
        `Please click this link to verify: ${verificationLink}`
    );
  } catch (error) {
    console.error("Error in start command:", error);
    await ctx.reply("Sorry, there was an error. Please try again.");
  }
});

// Join command handler
bot.command("join", async (ctx) => {
  const userId = ctx.from.id.toString();

  console.log("Join command from user:", userId);

  const isVerified = await isUserVerified(userId);

  console.log("User verification status:", isVerified);

  if (!isVerified) {
    await ctx.reply(
      "You need to verify your wallet first!\n" +
        "Use /start to begin the verification process."
    );
    return;
  }

  try {
    // Generate group invite link
    const link = await ctx.telegram.createChatInviteLink(GROUP_ID, {
      expire_date: Math.floor(Date.now() / 1000) + 300, // 5 minutes
      member_limit: 1,
    });

    await ctx.reply(
      `Here's your invite link: ${link.invite_link}\nIt will expire in 5 minutes.`
    );
  } catch (error) {
    console.error("Error generating invite link:", error);
    await ctx.reply(
      "Sorry, there was an error generating the invite link. Please try again later."
    );
  }
});

// Add command to refresh all user tags
bot.command("refreshtags", async (ctx) => {
  // Check if user is a real admin
  const admins = await ctx.getChatAdministrators();
  const isRealAdmin = admins.some(
    (admin) =>
      admin.user.id === ctx.from?.id &&
      (admin.status === "creator" || admin.can_promote_members)
  );

  if (!isRealAdmin) return;

  try {
    let updated = 0;
    const members = await ctx.getChatAdministrators();

    for (const member of members) {
      const tag = await getUserTag(member.user.id.toString());
      if (tag) {
        await ctx.telegram.setChatAdministratorCustomTitle(
          GROUP_ID,
          member.user.id,
          tag
        );
        updated++;
      }
    }

    await ctx.reply(`Updated ${updated} member tags.`);
  } catch (error) {
    console.error("Error refreshing tags:", error);
    await ctx.reply("Error updating tags.");
  }
});
// Handle restricted users joining
bot.on("chat_member", async (ctx) => {
  if (ctx.chatMember.new_chat_member.status === "restricted") {
    const userId = ctx.chatMember.new_chat_member.user.id;

    // Send DM to user
    try {
      await bot.telegram.sendMessage(
        userId,
        "Welcome! To see messages in the group, you need to verify your wallet first.\n" +
          "Please start the verification process by clicking here: @PlebXRD_Bot"
      );
    } catch (error) {
      console.error("Error sending welcome DM:", error);
    }
  }
});

// Handle new members
bot.on("new_chat_members", async (ctx) => {
  if (ctx.chat.id.toString() !== GROUP_ID) return;

  // Send welcome message in group
  const welcomeMsg = await ctx.reply(
    `Welcome to capitalism and political cronyism! 🎉\n\n` +
      `To token weight your shitty opinions, you'll need to verify your Radix wallet before you can see messages.\n\n` +
      `PLEB bot has sent you instructions in a private message - please check your DMs from @${ctx.botInfo.username}!\n\n` +
      `Once verified, you'll get full access to the group automatically. 🚀`
  );

  setTimeout(
    () => {
      ctx.deleteMessage(welcomeMsg.message_id).catch(console.error);
    },
    5 * 60 * 1000
  );

  for (const newMember of ctx.message.new_chat_members) {
    const userId = newMember.id;
    const isVerified = await isUserVerified(userId.toString());

    if (!isVerified) {
      try {
        // Restrict member from seeing messages
        await ctx.restrictChatMember(userId, {
          permissions: {
            can_send_messages: false,
            can_send_other_messages: false,
            can_add_web_page_previews: false,
          },
        });

        // Send them a DM
        await bot.telegram.sendMessage(
          userId,
          `👋 Welcome to the token-weighted Radix community!\n\n` +
            `To keep our group secure, we require wallet verification before you can participate.\n\n` +
            `🔑 Here's how to get started:\n` +
            `1. Click this link to start chatting with me: @${ctx.botInfo.username}\n` +
            `2. Send me the /start command\n` +
            `3. Follow the verification link I'll send you\n` +
            `4. Once verified, you'll automatically get access to the group!\n\n` +
            `Need help? Just send me /help in our private chat.`
        );
      } catch (error) {
        console.error("Error handling unverified member:", error);
      }
      continue;
    }

    // If verified, give them full permissions
    await ctx.restrictChatMember(userId, {
      permissions: {
        can_send_messages: true,
        can_send_audios: true,
        can_send_videos: true,
        can_send_photos: true,
        can_send_voice_notes: true,
        can_send_polls: true,
        can_pin_messages: false,
        can_manage_topics: false,
        can_change_info: false,
        can_send_video_notes: true,
        can_send_documents: true,
        can_invite_users: true,
        can_send_other_messages: true,
        can_add_web_page_previews: true,
      },
    });

    // Set user's tag as their flair
    const tag = await getUserTag(userId.toString());
    if (tag) {
      try {
        await ctx.setChatAdministratorCustomTitle(userId, tag);
      } catch (error) {
        console.error("Error setting user flair:", error);
      }
    }
  }
});

// Optional: Add a command to list all users with their flairs
bot.command("flairs", async (ctx) => {
  try {
    const chatMembers = await ctx.getChatAdministrators();
    let message = "👥 Member Flairs:\n\n";

    for (const member of chatMembers) {
      const tag = await getUserTag(member.user.id.toString());
      if (tag) {
        const name = member.user.username || member.user.first_name;
        message += `@${name}: ${tag}\n`;
      }
    }

    await ctx.reply(message);
  } catch (error) {
    console.error("Error listing flairs:", error);
    await ctx.reply("Error fetching flair list.");
  }
});

// Test command to check a single user's flair
bot.command("testflair", async (ctx) => {
  const userId = ctx.from.id.toString();
  console.log("Testing flair for user:", userId);

  try {
    const tag = await getUserTag(userId);
    console.log("Found tag:", tag);

    await ctx.reply(
      `Your user ID: ${userId}\nYour flair: ${tag || "No flair found"}`
    );
  } catch (error) {
    console.error("Error in test:", error);
    await ctx.reply("Error testing flair");
  }
});

// Error handling
bot.catch((err: any, ctx: Context) => {
  console.error(`Error for ${ctx.updateType}:`, err);
});

// Add this command to your bot
bot.command("getchatid", (ctx) => {
  ctx.reply(`Chat ID: ${ctx.chat.id}`);
  console.log("Chat details:", ctx.chat);
});
// Start the bot

// Improved launch with error handling
const startBot = async () => {
  try {
    // Clear webhook before polling
    await bot.telegram.deleteWebhook();

    // Launch with specific options
    await bot.launch({
      dropPendingUpdates: true,
      allowedUpdates: ["message", "callback_query"],
    });

    console.log(`Bot started successfully in ${process.env.NODE_ENV} mode`);
  } catch (error) {
    console.error("Failed to start bot:", error);
    process.exit(1);
  }
};

startBot();

// Graceful stop with logging
const shutdown = (signal: string) => {
  console.log(`Received ${signal}, gracefully shutting down`);
  bot.stop(signal);
  process.exit(0);
};
// Make sure the server listens on 0.0.0.0 to accept external connections
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});

// Enable graceful stop
process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
