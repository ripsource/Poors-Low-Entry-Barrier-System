import { Curve } from "../..";
import { Bytes } from "./utils";
export declare abstract class PublicKey {
    abstract readonly curve: Curve;
    abstract readonly bytes: Uint8Array;
    static Secp256k1: {
        new (bytes: Bytes): {
            readonly curve: Curve;
            readonly bytes: Uint8Array;
            rawBytes: () => Uint8Array;
            hexString: () => string;
            toString: () => string;
            hex: () => string;
            readonly publicKey: Uint8Array;
        };
        Secp256k1: any;
        Ed25519: {
            new (bytes: Bytes): {
                readonly curve: Curve;
                readonly bytes: Uint8Array;
                rawBytes: () => Uint8Array;
                hexString: () => string;
                toString: () => string;
                hex: () => string;
                readonly publicKey: Uint8Array;
            };
            Secp256k1: any;
            Ed25519: any;
        };
    };
    static Ed25519: {
        new (bytes: Bytes): {
            readonly curve: Curve;
            readonly bytes: Uint8Array;
            rawBytes: () => Uint8Array;
            hexString: () => string;
            toString: () => string;
            hex: () => string;
            readonly publicKey: Uint8Array;
        };
        Secp256k1: {
            new (bytes: Bytes): {
                readonly curve: Curve;
                readonly bytes: Uint8Array;
                rawBytes: () => Uint8Array;
                hexString: () => string;
                toString: () => string;
                hex: () => string;
                readonly publicKey: Uint8Array;
            };
            Secp256k1: any;
            Ed25519: any;
        };
        Ed25519: any;
    };
    rawBytes: () => Uint8Array;
    hexString: () => string;
    toString: () => string;
    hex: () => string;
    get publicKey(): Uint8Array;
}
