import { Signer, SignerResponse } from "../";
export type SignatureSource<T> = Signer | T | SignatureFunction<T>;
export type SignatureFunction<T> = (messageHash: Uint8Array) => T;
export declare const resolveSignatureSource: <T>(source: SignatureSource<T>, messageHash: Uint8Array, signerResponseCallback: (signerResponse: SignerResponse) => T) => T;
