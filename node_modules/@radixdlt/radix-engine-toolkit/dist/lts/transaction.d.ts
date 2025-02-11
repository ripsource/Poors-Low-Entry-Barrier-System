import Decimal from "decimal.js";
import { Intent, NotarizedTransaction, RawRadixEngineToolkit, Signature, SignatureFunction, SignatureSource, SignedIntent, TransactionHash } from "..";
export declare class LTSTransactionIntent implements CompilableIntent, HasCompiledIntent {
    private readonly intent;
    constructor(intent: Intent);
    compile(): Promise<Uint8Array>;
    compiledIntent(): Promise<Uint8Array>;
    transactionId(): Promise<TransactionHash>;
}
export declare class LTSSignedTransactionIntent implements CompilableIntent, HasCompiledIntent {
    private readonly intent;
    constructor(intent: SignedIntent);
    compile(): Promise<Uint8Array>;
    compiledIntent(): Promise<Uint8Array>;
    transactionId(): Promise<TransactionHash>;
    intentHash(): Promise<TransactionHash>;
    signedIntentHash(): Promise<TransactionHash>;
}
export declare class LTSNotarizedTransaction implements CompilableIntent, HasCompiledIntent {
    private readonly transaction;
    constructor(transaction: NotarizedTransaction);
    compile(): Promise<Uint8Array>;
    compiledIntent(): Promise<Uint8Array>;
    transactionId(): Promise<TransactionHash>;
    intentHash(): Promise<TransactionHash>;
    signedIntentHash(): Promise<TransactionHash>;
    notarizedPayloadHash(): Promise<TransactionHash>;
}
export interface CompilableIntent {
    compile(): Promise<Uint8Array>;
}
export declare class CompiledSignedTransactionIntent implements HasCompiledIntent {
    private readonly retWrapper;
    private readonly signedIntent;
    readonly intentHash: TransactionHash;
    readonly compiledSignedIntent: Uint8Array;
    readonly signedIntentHash: TransactionHash;
    constructor(retWrapper: RawRadixEngineToolkit, intentHash: TransactionHash, signedIntent: SignedIntent, compiledSignedIntent: Uint8Array, signedIntentHash: TransactionHash);
    compiledIntent(): Promise<Uint8Array>;
    /**
     * @returns The hash to notarize (the signed intent hash)
     */
    get hashToNotarize(): Uint8Array;
    /**
     * @returns The transaction identifier (also known as the intent hash) of the transaction.
     */
    get transactionId(): TransactionHash;
    toByteArray(): Uint8Array;
    compileNotarizedAsync(source: SignatureFunction<Promise<Signature>>): Promise<CompiledNotarizedTransaction>;
    compileNotarized(source: SignatureSource<Signature>): CompiledNotarizedTransaction;
    private compileNotarizedInternal;
    /**
     * @returns The transaction identifier (also known as the intent hash) of the transaction, encoded into hex.
     */
    intentHashHex(): string;
    /**
     * Decompiles and summarizes a compiled intent extracting information such as locked fees,
     * deposits, and withdrawals.
     */
    summarizeTransaction(): Promise<TransactionSummary>;
}
export declare class CompiledNotarizedTransaction implements HasCompiledIntent {
    readonly compiled: Uint8Array;
    readonly intentHash: TransactionHash;
    readonly notarizedPayloadHash: TransactionHash;
    constructor(intentHash: TransactionHash, compiled: Uint8Array, notarizedPayloadHash: TransactionHash);
    compiledIntent(): Promise<Uint8Array>;
    /**
     * @returns The transaction identifier (also known as the intent hash) of the transaction.
     */
    get transactionId(): TransactionHash;
    toByteArray(): Uint8Array;
    toHex(): string;
    /**
     * @returns The transaction identifier (also known as the intent hash) of the transaction, encoded into hex.
     */
    intentHashHex(): string;
    /**
     * @returns The transaction identifier (also known as the intent hash) of the transaction, encoded into hex.
     */
    transactionIdHex(): string;
    /**
     * @returns The (notarized) payload hash, encoded into hex.
     */
    notarizedPayloadHashHex(): string;
    staticallyValidate(networkId: number): Promise<TransactionValidity>;
    /**
     * Summarizes a compiled intent extracting information such as locked fees, deposits, and
     * withdrawals.
     */
    summarizeTransaction(): Promise<TransactionSummary>;
}
export interface TransactionValidity {
    /**
     * A boolean that indicates whether or not the transaction is valid.
     */
    isValid: boolean;
    /**
     * An optional error message. This message only exists if the transaction is invalid.
     */
    errorMessage: string | undefined;
    throwIfInvalid(): void;
}
export interface TransactionSummary {
    feesLocked: {
        account: string;
        amount: Decimal;
    };
    withdraws: Record<string, Record<string, Decimal>>;
    deposits: Record<string, Record<string, Decimal>>;
}
export interface HasCompiledIntent {
    compiledIntent(): Promise<Uint8Array>;
}
