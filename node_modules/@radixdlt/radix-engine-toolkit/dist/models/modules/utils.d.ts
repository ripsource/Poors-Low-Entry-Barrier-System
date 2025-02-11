export interface KnownAddresses {
    resourceAddresses: ResourceAddresses;
    packageAddresses: PackageAddresses;
    componentAddresses: ComponentAddresses;
}
export interface ResourceAddresses {
    xrd: string;
    secp256k1SignatureVirtualBadge: string;
    ed25519SignatureVirtualBadge: string;
    packageOfDirectCallerVirtualBadge: string;
    globalCallerVirtualBadge: string;
    systemTransactionBadge: string;
    packageOwnerBadge: string;
    validatorOwnerBadge: string;
    accountOwnerBadge: string;
    identityOwnerBadge: string;
}
export interface PackageAddresses {
    packagePackage: string;
    resourcePackage: string;
    accountPackage: string;
    identityPackage: string;
    consensusManagerPackage: string;
    accessControllerPackage: string;
    poolPackage: string;
    transactionProcessorPackage: string;
    metadataModulePackage: string;
    royaltyModulePackage: string;
    roleAssignmentModulePackage: string;
    genesisHelperPackage: string;
    faucetPackage: string;
}
export interface ComponentAddresses {
    consensusManager: string;
    genesisHelper: string;
    faucet: string;
}
