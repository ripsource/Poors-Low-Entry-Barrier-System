import Decimal from "decimal.js";
export interface ExecutionAnalysis {
    feeLocks: FeeLocks;
    feeSummary: FeeSummary;
    transactionTypes: TransactionType[];
    reservedInstructions: ReservedInstruction[];
}
export type TransactionType = {
    kind: "SimpleTransfer";
    from: string;
    to: string;
    transferred: ResourceSpecifier;
} | {
    kind: "Transfer";
    from: string;
    transfers: Record<string, Record<string, Resources>>;
} | {
    kind: "AccountDepositSettings";
    resourcePreferenceChanges: Record<string, Record<string, ResourcePreferenceAction>>;
    defaultDepositRuleChanges: Record<string, DefaultDepositRule>;
    authorizedDepositorsChanges: Record<string, AuthorizedDepositorsChanges>;
} | {
    kind: "GeneralTransaction";
    accountProofs: string[];
    accountWithdraws: Record<string, ResourceTracker[]>;
    accountDeposits: Record<string, ResourceTracker[]>;
    addressesInManifest: Record<string, Set<string>>;
    dataOfNewlyMintedNonFungibles: Record<string, Record<string, Uint8Array>>;
};
export type ResourceSpecifier = {
    kind: "Amount";
    resourceAddress: string;
    amount: Decimal;
} | {
    kind: "Ids";
    resourceAddress: string;
    ids: string[];
};
export type Resources = {
    kind: "Amount";
    amount: Decimal;
} | {
    kind: "Ids";
    nonFungibleLocalId: string[];
};
export declare enum ResourcePreference {
    Allowed = "Allowed",
    Disallowed = "Disallowed"
}
export type ResourcePreferenceAction = {
    kind: "Set";
    value: ResourcePreference;
} | {
    kind: "Remove";
};
export declare enum DefaultDepositRule {
    Accept = "Accept",
    Reject = "Reject",
    AllowExisting = "AllowExisting"
}
export interface AuthorizedDepositorsChanges {
    added: ResourceOrNonFungible[];
    removed: ResourceOrNonFungible[];
}
export type ResourceOrNonFungible = {
    kind: "NonFungible";
    nonFungibleGlobalId: string;
} | {
    kind: "Resource";
    resourceAddress: string;
};
export type ResourceTracker = {
    kind: "Fungible";
    resourceAddress: string;
    amount: Source<Decimal>;
} | {
    kind: "NonFungible";
    resourceAddress: string;
    amount: Source<Decimal>;
    ids: Source<string[]>;
};
export type Source<T> = {
    kind: "Guaranteed";
    value: T;
} | {
    kind: "Predicted";
    value: T;
    instructionIndex: number;
};
export type DecimalSource = Source<Decimal>;
export type NonFungibleLocalIdArraySource = Source<string[]>;
export interface FeeLocks {
    lock: Decimal;
    contingentLock: Decimal;
}
export interface FeeSummary {
    executionCost: Decimal;
    finalizationCost: Decimal;
    storageExpansionCost: Decimal;
    royaltyCost: Decimal;
}
export declare enum ReservedInstruction {
    AccountLockFee = "AccountLockFee",
    AccountSecurify = "AccountSecurify",
    IdentitySecurify = "IdentitySecurify",
    AccountUpdateSettings = "AccountUpdateSettings",
    AccessController = "AccessController"
}
