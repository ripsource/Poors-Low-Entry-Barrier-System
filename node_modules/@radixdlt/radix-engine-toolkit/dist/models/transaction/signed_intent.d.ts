import { Intent, SignatureWithPublicKey } from "../..";
export interface SignedIntent {
    intent: Intent;
    intentSignatures: SignatureWithPublicKey[];
}
