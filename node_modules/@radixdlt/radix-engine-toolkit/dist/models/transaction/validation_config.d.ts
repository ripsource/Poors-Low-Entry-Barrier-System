export interface MessageValidationConfig {
    maxPlaintextMessageLength: bigint;
    maxEncryptedMessageLength: bigint;
    maxMimeTypeLength: bigint;
    maxDecryptors: bigint;
}
export interface ValidationConfig {
    networkId: number;
    maxNotarizedPayloadSize: bigint;
    minTipPercentage: number;
    maxTipPercentage: number;
    maxEpochRange: bigint;
    messageValidation: MessageValidationConfig;
}
export declare const defaultValidationConfig: (networkId: number) => ValidationConfig;
