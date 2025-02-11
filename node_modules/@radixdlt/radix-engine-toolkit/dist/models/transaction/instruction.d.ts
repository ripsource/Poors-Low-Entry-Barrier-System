import Decimal from "decimal.js";
import { ManifestAddress, Value } from "../../";
export type Instruction = {
    kind: "TakeAllFromWorktop";
    resourceAddress: string;
} | {
    kind: "TakeFromWorktop";
    resourceAddress: string;
    amount: Decimal;
} | {
    kind: "TakeNonFungiblesFromWorktop";
    resourceAddress: string;
    ids: string[];
} | {
    kind: "ReturnToWorktop";
    bucketId: number;
} | {
    kind: "AssertWorktopContainsAny";
    resourceAddress: string;
} | {
    kind: "AssertWorktopContains";
    resourceAddress: string;
    amount: Decimal;
} | {
    kind: "AssertWorktopContainsNonFungibles";
    resourceAddress: string;
    ids: string[];
} | {
    kind: "PopFromAuthZone";
} | {
    kind: "PushToAuthZone";
    proofId: number;
} | {
    kind: "DropAuthZoneProofs";
} | {
    kind: "CreateProofFromAuthZoneOfAmount";
    resourceAddress: string;
    amount: Decimal;
} | {
    kind: "CreateProofFromAuthZoneOfNonFungibles";
    resourceAddress: string;
    ids: string[];
} | {
    kind: "CreateProofFromAuthZoneOfAll";
    resourceAddress: string;
} | {
    kind: "DropNamedProofs";
} | {
    kind: "DropAuthZoneRegularProofs";
} | {
    kind: "DropAuthZoneSignatureProofs";
} | {
    kind: "CreateProofFromBucketOfAmount";
    bucketId: number;
    amount: Decimal;
} | {
    kind: "CreateProofFromBucketOfNonFungibles";
    bucketId: number;
    ids: string[];
} | {
    kind: "CreateProofFromBucketOfAll";
    bucketId: number;
} | {
    kind: "BurnResource";
    bucketId: number;
} | {
    kind: "CloneProof";
    proofId: number;
} | {
    kind: "DropProof";
    proofId: number;
} | {
    kind: "CallFunction";
    packageAddress: ManifestAddress;
    blueprintName: string;
    functionName: string;
    args: Value;
} | {
    kind: "CallMethod";
    address: ManifestAddress;
    methodName: string;
    args: Value;
} | {
    kind: "CallRoyaltyMethod";
    address: ManifestAddress;
    methodName: string;
    args: Value;
} | {
    kind: "CallMetadataMethod";
    address: ManifestAddress;
    methodName: string;
    args: Value;
} | {
    kind: "CallRoleAssignmentMethod";
    address: ManifestAddress;
    methodName: string;
    args: Value;
} | {
    kind: "CallDirectVaultMethod";
    address: string;
    methodName: string;
    args: Value;
} | {
    kind: "DropAllProofs";
} | {
    kind: "AllocateGlobalAddress";
    packageAddress: string;
    blueprintName: string;
};
