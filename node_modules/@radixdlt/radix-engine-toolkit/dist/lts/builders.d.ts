import Decimal from "decimal.js";
import { CompiledNotarizedTransaction, CompiledSignedTransactionIntent, PublicKey, RawRadixEngineToolkit, SignatureFunction, SignatureSource, SignatureWithPublicKey } from "..";
export interface SimpleTransactionBuilderSettings {
    networkId: number;
    validFromEpoch: number;
    fromAccount: string;
    signerPublicKey: PublicKey;
}
export interface SimpleTransactionBuilderFreeXrdSettings {
    networkId: number;
    validFromEpoch: number;
    toAccount: string;
}
/**
 * A builder class used for building single signature transactions with the notary as a signer.
 */
export declare class SimpleTransactionBuilder {
    private retWrapper;
    private _startEpoch;
    private _expiresAfterEpochs;
    private _networkId;
    private _nonce;
    private _tipPercentage;
    private _notaryPublicKey;
    private _fromAccount;
    private _feePayer;
    private _feeAmount;
    private _actions;
    constructor(retWrapper: RawRadixEngineToolkit, startEpoch: number, networkId: number, fromAccount: string, notaryPublicKey: PublicKey, nonce: number);
    static new(settings: SimpleTransactionBuilderSettings): Promise<SimpleTransactionBuilder>;
    static freeXrdFromFaucet(settings: SimpleTransactionBuilderFreeXrdSettings): Promise<CompiledNotarizedTransaction>;
    nonce(nonce: number): this;
    feePayer(address: string): this;
    /**
     * Set the number of epochs this transaction is valid for (including the current epoch - which might nearly be over!)
     * Each epoch is approximately 5 minutes long.
     *
     * If `validFromEpoch` is set to the current epoch, then there are 0-5 minutes left of this first epoch.
     * So `expiresAfterEpochs(10)` would result in the transaction permanently rejecting after approximately 45-50 minutes.
     *
     * @param epochCount The number of epochs after with the transaction permanently rejects.
     * @returns the builder
     */
    permanentlyRejectAfterEpochs(epochCount: number): this;
    tipPercentage(tipPercentage: number): this;
    /**
     * @param amount The amount of fee to lock. If not set, it will be 5 XRD.
     * @returns the builder
     */
    lockedFee(amount: Amount): this;
    transferFungible(transfer: {
        toAccount: string;
        resourceAddress: string;
        amount: Amount;
    }): this;
    /**
     * This compiles the "signed intent" without any additional signatures (other than the notary
     * which will count as a signatory).
     * @returns the compiled intent, along with the `hashToNotarize` which needs to be signed.
     */
    compileIntent(): CompiledSignedTransactionIntent;
    compileIntentWithSignatures(signatureSources: Array<SignatureSource<SignatureWithPublicKey>>): CompiledSignedTransactionIntent;
    compileIntentWithSignaturesAsync(signatureSources: Array<SignatureFunction<Promise<SignatureWithPublicKey>>>): Promise<CompiledSignedTransactionIntent>;
    private constructTransactionHeader;
    private constructTransactionManifest;
    private resolveActions;
    private resolveFeeAmount;
}
export type Amount = string | number | Decimal;
export declare function resolveDecimal(amount: Amount): Decimal;
