import { PublicKey } from "../..";
export interface TransactionHeader {
    networkId: number;
    startEpochInclusive: number;
    endEpochExclusive: number;
    nonce: number;
    notaryPublicKey: PublicKey;
    notaryIsSignatory: boolean;
    tipPercentage: number;
}
