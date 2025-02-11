import { Curve, PublicKey, Signature, SignatureWithPublicKey } from "../..";
import { Bytes } from "./utils";
export declare abstract class PrivateKey implements Signer {
    abstract readonly curve: Curve;
    abstract readonly bytes: Uint8Array;
    static Secp256k1: {
        new (privateKey: Bytes): {
            readonly curve: Curve;
            readonly bytes: Uint8Array;
            publicKey(): PublicKey;
            publicKeyBytes(): Uint8Array;
            publicKeyHex(): string;
            sign(messageHash: Uint8Array): Uint8Array;
            signToSignature(messageHash: Uint8Array): Signature;
            signToSignatureWithPublicKey(messageHash: Uint8Array): SignatureWithPublicKey;
            produceSignature(messageHash: Uint8Array): SignerResponse;
        };
        Secp256k1: any;
        Ed25519: {
            new (privateKey: Bytes): {
                readonly curve: Curve;
                readonly bytes: Uint8Array;
                publicKey(): PublicKey;
                publicKeyBytes(): Uint8Array;
                publicKeyHex(): string;
                sign(messageHash: Uint8Array): Uint8Array;
                signToSignature(messageHash: Uint8Array): Signature;
                signToSignatureWithPublicKey(messageHash: Uint8Array): SignatureWithPublicKey;
                produceSignature(messageHash: Uint8Array): SignerResponse;
            };
            Secp256k1: any;
            Ed25519: any;
        };
    };
    static Ed25519: {
        new (privateKey: Bytes): {
            readonly curve: Curve;
            readonly bytes: Uint8Array;
            publicKey(): PublicKey;
            publicKeyBytes(): Uint8Array;
            publicKeyHex(): string;
            sign(messageHash: Uint8Array): Uint8Array;
            signToSignature(messageHash: Uint8Array): Signature;
            signToSignatureWithPublicKey(messageHash: Uint8Array): SignatureWithPublicKey;
            produceSignature(messageHash: Uint8Array): SignerResponse;
        };
        Secp256k1: {
            new (privateKey: Bytes): {
                readonly curve: Curve;
                readonly bytes: Uint8Array;
                publicKey(): PublicKey;
                publicKeyBytes(): Uint8Array;
                publicKeyHex(): string;
                sign(messageHash: Uint8Array): Uint8Array;
                signToSignature(messageHash: Uint8Array): Signature;
                signToSignatureWithPublicKey(messageHash: Uint8Array): SignatureWithPublicKey;
                produceSignature(messageHash: Uint8Array): SignerResponse;
            };
            Secp256k1: any;
            Ed25519: any;
        };
        Ed25519: any;
    };
    abstract publicKey(): PublicKey;
    abstract publicKeyBytes(): Uint8Array;
    abstract publicKeyHex(): string;
    abstract sign(messageHash: Uint8Array): Uint8Array;
    abstract signToSignature(messageHash: Uint8Array): Signature;
    abstract signToSignatureWithPublicKey(messageHash: Uint8Array): SignatureWithPublicKey;
    produceSignature(messageHash: Uint8Array): SignerResponse;
}
export interface Signer {
    produceSignature: (messageHash: Uint8Array) => SignerResponse;
}
export interface AsyncSigner {
    produceSignature: (messageHash: Uint8Array) => Promise<SignerResponse>;
}
export type SignerResponse = {
    curve: Curve;
    signature: Uint8Array;
    publicKey: Uint8Array;
};
