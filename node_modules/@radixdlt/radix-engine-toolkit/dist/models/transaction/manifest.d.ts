import { Instructions } from "../../";
export interface TransactionManifest {
    instructions: Instructions;
    blobs: Uint8Array[];
}
