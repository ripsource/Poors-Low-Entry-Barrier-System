import { Curve } from "../..";
import { Bytes } from "./utils";
export declare abstract class SignatureWithPublicKey {
    abstract readonly curve: Curve;
    abstract readonly signature: Uint8Array;
    abstract readonly publicKey: Uint8Array | undefined;
    static Secp256k1: {
        new (signature: Bytes): {
            readonly curve: Curve;
            readonly signature: Uint8Array;
            readonly publicKey: undefined;
        };
        Secp256k1: any;
        Ed25519: {
            new (signature: Bytes, publicKey: Bytes): {
                readonly curve: Curve;
                readonly signature: Uint8Array;
                readonly publicKey: Uint8Array;
            };
            Secp256k1: any;
            Ed25519: any;
        };
    };
    static Ed25519: {
        new (signature: Bytes, publicKey: Bytes): {
            readonly curve: Curve;
            readonly signature: Uint8Array;
            readonly publicKey: Uint8Array;
        };
        Secp256k1: {
            new (signature: Bytes): {
                readonly curve: Curve;
                readonly signature: Uint8Array;
                readonly publicKey: undefined;
            };
            Secp256k1: any;
            Ed25519: any;
        };
        Ed25519: any;
    };
}
