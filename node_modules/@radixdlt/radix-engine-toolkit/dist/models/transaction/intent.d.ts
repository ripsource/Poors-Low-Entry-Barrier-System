import { Message, TransactionHeader, TransactionManifest } from "../../";
export interface Intent {
    header: TransactionHeader;
    manifest: TransactionManifest;
    message: Message;
}
