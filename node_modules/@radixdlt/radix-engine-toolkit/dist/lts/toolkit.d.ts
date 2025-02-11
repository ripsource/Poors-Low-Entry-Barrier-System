import { CompilableIntent, CompiledNotarizedTransaction, HasCompiledIntent, LTSNotarizedTransaction, LTSSignedTransactionIntent, LTSTransactionIntent, PublicKey, TransactionSummary } from "..";
export declare abstract class LTSRadixEngineToolkit {
    static Transaction: {
        new (): {};
        /**
         * Given a transaction intent of any type, this function compiles the transaction intent
         * returning a byte array of the compiled intent.
         * @param intent Any intent or transaction part that can be compiled.
         * @returns The compiled intent
         */
        compile(intent: CompilableIntent): Promise<Uint8Array>;
        /**
         * Compiles the `TransactionIntent` by calling the Radix Engine Toolkit and SBOR Encoding it.
         * @param transactionIntent The transaction intent to compile
         * @returns The compiled transaction intent
         */
        compileTransactionIntent(transactionIntent: LTSTransactionIntent): Promise<Uint8Array>;
        /**
         * Compiles the `SignedTransactionIntent` by calling the Radix Engine Toolkit and SBOR Encoding it.
         * @param signedTransactionIntent The signed transaction intent to compile
         * @returns The compiled signed transaction intent
         */
        compileSignedTransactionIntent(signedTransactionIntent: LTSSignedTransactionIntent): Promise<Uint8Array>;
        /**
         * Compiles the `NotarizedTransaction` by calling the Radix Engine Toolkit and SBOR Encoding it.
         * @param notarizedTransactionIntent The signed transaction intent to compile
         * @returns The compiled signed transaction intent
         */
        compileNotarizedTransactionIntent(notarizedTransactionIntent: LTSNotarizedTransaction): Promise<Uint8Array>;
        /**
         * Decompiles and summarizes a compiled intent extracting information such as locked fees,
         * deposits, and withdrawals.
         * @param compiledIntent The compiled intent to produce a summary for. This function accepts any
         * object that we can extract the compiled intent from.
         * @returns A summary on the transaction of the various withdraws, deposits, and locked fees
         * that can be statically obtained from the manifest.
         *
         * @remarks
         * This function only works for manifests that perform simple transfers which were created
         * through the SimpleTransactionBuilder class and will not work for any other more complex
         * transactions since this information might not be available to obtain statically from the
         * manifest.
         */
        summarizeTransaction(transaction: HasCompiledIntent | Uint8Array): Promise<TransactionSummary>;
    };
    static Derive: {
        new (): {};
        /**
         * Given a public key and network id, this function deterministically calculates the address of
         * the virtual account component address associated with the public key.
         * @param publicKey An Ecdsa Secp256k1 or EdDSA Ed25519 public key to derive the virtual account
         * address for.
         * @param networkId The network that the virtual account address is meant for. This will be used
         * for the Bech32m encoding of the address.
         * @returns The address of the virtual account as a string.
         */
        virtualAccountAddress(publicKey: PublicKey, networkId: number): Promise<string>;
        /**
         * Given an Olympia account address, this function deterministically calculates the address of
         * the associated virtual account on a Babylon network of a given network id.
         * @param olympiaAddress The Olympia account address to derive the associated Babylon virtual
         * account address for.
         * @param networkId The **Babylon** network id to derive the Babylon account address for. This is
         * primarily used for the Bech32m encoding of addresses. This argument defaults to `1` which is
         * the network id of the Babylon mainnet
         * @returns An object containing all of the mapping information of the address
         */
        babylonAccountAddressFromOlympiaAccountAddress(olympiaAddress: string, networkId: number): Promise<OlympiaToBabylonAddressMapping>;
        /**
         * Given an Olympia account address, this function deterministically calculates the address of
         * the associated virtual account on a Babylon network of a given network id.
         * @param olympiaResourceAddress The Olympia account address to derive the associated Babylon virtual
         * account address for.
         * @param networkId The **Babylon** network id to derive the Babylon account address for. This is
         * primarily used for the Bech32m encoding of addresses. This argument defaults to `1` which is
         * the network id of the Babylon mainnet
         * @returns An object containing all of the mapping information of the address
         */
        babylonResourceAddressFromOlympiaResourceAddress(olympiaResourceAddress: string, networkId: number): Promise<string>;
        /**
         * Derives the addresses of a set of known entities on the specified network.
         * @param networkId The network id to ge the known entity addresses for.
         * @returns An object containing the entity addresses on the network with the specified id.
         */
        knownAddresses(networkId: number): Promise<AddressBook>;
        bech32mTransactionIdentifierFromIntentHash(transactionHash: Uint8Array, networkId: number): Promise<string>;
    };
    static Address: {
        new (): {};
        isGlobalAccount(address: string): Promise<boolean>;
        isFungibleResource(address: string): Promise<boolean>;
        isNonFungibleResource(address: string): Promise<boolean>;
    };
    static Utils: {
        new (): {};
        /**
         * This function hashes a given byte array of data through the hashing algorithm used by the
         * Radix Engine and Scrypto. The hashing algorithm adopted by the Radix stack is Blake2b with 32
         * byte digests.
         * @param data The data to hash
         * @returns The hash of the data
         */
        hash(data: Uint8Array): Uint8Array;
    };
    /**
     * A sub-API of the toolkit that includes contains utility functions used for testing.
     */
    static TestUtils: {
        new (): {};
        /**
         * Creates a new account that has a default deposit rule of disallowing resource deposits. The
         * created account is a virtual account derived from the public key of a pseudo-random private
         * key. Thus, this function should only be used for testing.
         * @param currentEpoch The current epoch of the network that this transaction will be submitted
         * to.
         * @param networkId The id of the network that this transaction is constructed for.
         * @returns An object containing the address of the soon-to-be-created account with deposits
         * disabled and the compiled notarized transaction to submit the ledger to create the account.
         */
        createAccountWithDisabledDeposits(currentEpoch: number, networkId: number): Promise<{
            accountAddress: string;
            compiledNotarizedTransaction: CompiledNotarizedTransaction;
        }>;
    };
}
export interface OlympiaToBabylonAddressMapping {
    /**
     * The underling public key encoded in the Olympia account address.
     */
    publicKey: PublicKey;
    /**
     * The Olympia account address associated with the given public key.
     */
    olympiaAccountAddress: string;
    /**
     * The Babylon account address associated with a given Olympia account address.
     */
    babylonAccountAddress: string;
}
export interface AddressBook {
    resources: {
        xrdResource: string;
        secp256k1Resource: string;
        ed25519Resource: string;
        systemResource: string;
        packageBadgeResource: string;
    };
    components: {
        faucet: string;
    };
    packages: {
        faucet: string;
        account: string;
    };
}
