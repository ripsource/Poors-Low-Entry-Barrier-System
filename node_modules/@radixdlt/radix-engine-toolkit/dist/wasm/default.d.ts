import { BuildInformation, EntityType, Instructions, Intent, KnownAddresses, ManifestSborStringRepresentation, NotarizedTransaction, OlympiaNetwork, PublicKey, SerializationMode, SignedIntent, StaticValidationResult, TransactionHash, TransactionManifest, ValidationConfig } from "../";
export declare class RadixEngineToolkit {
    /**
     * A module of the Radix Engine Toolkit which exposes information relating to the build of the
     * toolkit in use.
     */
    static Build: {
        new (): {};
        /**
         * Returns information on the core Radix Engine Toolkit WASM such as it's version and the
         * version of the Scrypto dependency in it.
         * @returns Information on the version of the Radix Engine Toolkit's WASM and information on the
         * Scrypto dependency that was used to build the toolkit.
         */
        information(): Promise<BuildInformation>;
    };
    /**
     * A module of the Radix Engine Toolkit concerned with performing derivations.
     */
    static Derive: {
        new (): {};
        /**
         * Derives the virtual account address associated with the provided public key on the given
         * network.
         * @param publicKey The public key to derive virtual account address for.
         * @param networkId The id of the network that this address is to be used for. This is an 8-bit
         * unsigned integer in the range [0x00, 0xFF]
         * @returns A string of the bech32m encoded address of the virtual account address derived from
         * the public key.
         */
        virtualAccountAddressFromPublicKey(publicKey: PublicKey, networkId: number): Promise<string>;
        /**
         * Derives the virtual identity address associated with the provided public key on the given
         * network.
         * @param publicKey The public key to derive virtual identity address for.
         * @param networkId The id of the network that this address is to be used for. This is an 8-bit
         * unsigned integer in the range [0x00, 0xFF]
         * @returns A string of the bech32m encoded address of the virtual identity address derived from
         * the public key.
         */
        virtualIdentityAddressFromPublicKey(publicKey: PublicKey, networkId: number): Promise<string>;
        /**
         * Derives the address of the account on the Babylon network associated with an account on the
         * Olympia network.
         * @param olympiaAccountAddress The address of the account on the Olympia network.
         * @param networkId The id of the network that this address is to be used for. This is an 8-bit
         * unsigned integer in the range [0x00, 0xFF].
         * @returns A string of the bech32m encoded address of the virtual account address derived from
         * the olympia account address.
         */
        virtualAccountAddressFromOlympiaAccountAddress(olympiaAccountAddress: string, networkId: number): Promise<string>;
        /**
         * Derives the resource address on the Babylon network associated with a resource from the
         * Olympia network.
         * @param olympiaResourceAddress The address of the resource on the Olympia network.
         * @param networkId The id of the network that this address is to be used for. This is an 8-bit
         * unsigned integer in the range [0x00, 0xFF].
         * @returns A string of the bech32m encoded address of the resource address on the Babylon
         * network derived from the resource address form the Olympia network.
         */
        resourceAddressFromOlympiaResourceAddress(olympiaResourceAddress: string, networkId: number): Promise<string>;
        /**
         * Derives the public key of an Olympia account.
         * @param olympiaAccountAddress The address of the account on the Olympia network.
         * @returns A byte array of the Ecdsa Secp256k1 public key associated with the Olympia account.
         */
        publicKeyFromOlympiaAccountAddress(olympiaAccountAddress: string): Promise<Uint8Array>;
        /**
         * Derives the Olympia account address associated with a public key.
         * @param publicKey The Ecdsa Secp256k1 public key to derive the Olympia account address for.
         * @param olympiaNetwork The Olympia network to derive the account address for.
         * @returns The derived Olympia account address.
         */
        olympiaAccountAddressFromPublicKey(publicKey: Uint8Array, olympiaNetwork: OlympiaNetwork): Promise<string>;
        /**
         * Derives the node address from an Ecdsa Secp256k1 public key.
         * @param publicKey The Ecdsa Secp256k1 public key to derive the node address for.
         * @param networkId The network id of the node.
         * @returns The derived node address.
         */
        nodeAddressFromPublicKey(publicKey: Uint8Array, networkId: number): Promise<string>;
        bech32mTransactionIdentifierFromIntentHash(transactionHash: Uint8Array, networkId: number): Promise<string>;
    };
    /**
     * A module of the Radix Engine Toolkit concerned with functions that can be applied to
     * instructions.
     */
    static Instructions: {
        new (): {};
        /**
         * Converts {@link Instructions} from one format to another. Currently, the supported formats
         * are `String` and `Parsed`.
         * @param instructions The instructions the format should be changed for.
         * @param networkId The id of the network that the instructions are meant for.
         * @param instructionsKind The kind of instructions to get out.
         * @returns The converted instructions.
         */
        convert(instructions: Instructions, networkId: number, instructionsKind: "String" | "Parsed"): Promise<Instructions>;
        compile(instructions: Instructions, networkId: number): Promise<Uint8Array>;
        decompile(compiledInstructions: Uint8Array, networkId: number, instructionsKind?: "String" | "Parsed"): Promise<Instructions>;
        extractAddresses(instructions: Instructions, networkId: number): Promise<Record<EntityType, string[]>>;
        staticallyValidate(instructions: Instructions, networkId: number): Promise<StaticValidationResult>;
    };
    static TransactionManifest: {
        new (): {};
        compile(transactionManifest: TransactionManifest, networkId: number): Promise<Uint8Array>;
        decompile(compiledTransactionManifest: Uint8Array, networkId: number, instructionsKind?: "String" | "Parsed"): Promise<TransactionManifest>;
        staticallyValidate(transactionManifest: TransactionManifest, networkId: number): Promise<StaticValidationResult>;
    };
    static Intent: {
        new (): {};
        intentHash(intent: Intent): Promise<TransactionHash>;
        hash(intent: Intent): Promise<TransactionHash>;
        compile(intent: Intent): Promise<Uint8Array>;
        decompile(compiledIntent: Uint8Array, instructionsKind?: "String" | "Parsed"): Promise<Intent>;
        staticallyValidate(intent: Intent, validationConfig: ValidationConfig): Promise<StaticValidationResult>;
    };
    static SignedIntent: {
        new (): {};
        hash(signedIntent: SignedIntent): Promise<TransactionHash>;
        signedIntentHash(signedIntent: SignedIntent): Promise<TransactionHash>;
        intentHash(signedIntent: SignedIntent): Promise<TransactionHash>;
        compile(signedIntent: SignedIntent): Promise<Uint8Array>;
        decompile(compiledSignedIntent: Uint8Array, instructionsKind?: "String" | "Parsed"): Promise<SignedIntent>;
        staticallyValidate(signedIntent: SignedIntent, validationConfig: ValidationConfig): Promise<StaticValidationResult>;
    };
    static NotarizedTransaction: {
        new (): {};
        hash(notarizedTransaction: NotarizedTransaction): Promise<TransactionHash>;
        notarizedTransactionHash(notarizedTransaction: NotarizedTransaction): Promise<TransactionHash>;
        signedIntentHash(notarizedTransaction: NotarizedTransaction): Promise<TransactionHash>;
        intentHash(notarizedTransaction: NotarizedTransaction): Promise<TransactionHash>;
        compile(notarizedTransaction: NotarizedTransaction): Promise<Uint8Array>;
        decompile(compiledNotarizedTransaction: Uint8Array, instructionsKind?: "String" | "Parsed"): Promise<NotarizedTransaction>;
        staticallyValidate(notarizedTransaction: NotarizedTransaction, validationConfig: ValidationConfig): Promise<StaticValidationResult>;
    };
    static ManifestSbor: {
        new (): {};
        decodeToString(payload: Uint8Array, networkId: number, representation: ManifestSborStringRepresentation): Promise<string>;
    };
    static ScryptoSbor: {
        new (): {};
        decodeToString(payload: Uint8Array, networkId: number, representation: SerializationMode): Promise<string>;
        encodeProgrammaticJson(object: any): Promise<Uint8Array>;
    };
    static Address: {
        new (): {};
        entityType(address: string): Promise<EntityType>;
        decode(address: string): Promise<{
            networkId: number;
            entityType: EntityType;
            hrp: String;
            data: Uint8Array;
        }>;
    };
    static Utils: {
        new (): {};
        knownAddresses(networkId: number): Promise<KnownAddresses>;
    };
}
