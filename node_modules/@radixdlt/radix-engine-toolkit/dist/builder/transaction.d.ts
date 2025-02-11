import { Message, NotarizedTransaction, RawRadixEngineToolkit, Signature, SignatureFunction, SignatureSource, SignatureWithPublicKey, TransactionHeader, TransactionManifest } from "..";
export declare class TransactionBuilder {
    private readonly radixEngineToolkit;
    constructor(radixEngineToolkit: RawRadixEngineToolkit);
    static new(): Promise<TransactionBuilder>;
    header(header: TransactionHeader): TransactionBuilderManifestStep;
}
export declare class TransactionBuilderManifestStep {
    private readonly radixEngineToolkit;
    private readonly header;
    private intentMessage;
    constructor(radixEngineToolkit: RawRadixEngineToolkit, header: TransactionHeader);
    message(message: Message): TransactionBuilderManifestStep;
    plainTextMessage(message: string): TransactionBuilderManifestStep;
    manifest(manifest: TransactionManifest): TransactionBuilderIntentSignaturesStep;
}
export declare class TransactionBuilderIntentSignaturesStep {
    private readonly radixEngineToolkit;
    private readonly intent;
    private readonly intentSignatures;
    constructor(radixEngineToolkit: RawRadixEngineToolkit, header: TransactionHeader, manifest: TransactionManifest, message: Message);
    sign(source: SignatureSource<SignatureWithPublicKey>): this;
    signAsync(source: SignatureFunction<Promise<SignatureWithPublicKey>>): this;
    notarize(source: SignatureSource<Signature>): Promise<NotarizedTransaction>;
    notarizeAsync(source: SignatureFunction<Promise<Signature>>): Promise<NotarizedTransaction>;
    private resolveIntentSignatures;
    private intentHash;
    private signedIntentHash;
}
