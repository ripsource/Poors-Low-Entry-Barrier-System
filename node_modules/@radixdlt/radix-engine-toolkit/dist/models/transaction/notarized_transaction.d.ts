import { Signature, SignedIntent } from "../..";
export interface NotarizedTransaction {
    signedIntent: SignedIntent;
    notarySignature: Signature;
}
