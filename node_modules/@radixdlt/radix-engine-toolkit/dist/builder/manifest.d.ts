import Decimal from "decimal.js";
import { Bytes, TransactionManifest, Value, ValueKind } from "..";
export declare class ManifestBuilder {
    private instructions;
    private blobs;
    private idAllocator;
    takeAllFromWorktop(resourceAddress: string, callback: (builder: this, bucketId: number) => this): this;
    takeFromWorktop(resourceAddress: string, amount: Decimal, callback: (builder: this, bucketId: number) => this): this;
    takeNonFungiblesFromWorktop(resourceAddress: string, ids: string[], callback: (builder: this, bucketId: number) => this): this;
    returnToWorktop(bucketId: number): this;
    assertWorktopContainsAny(resourceAddress: string): this;
    assertWorktopContains(resourceAddress: string, amount: Decimal): this;
    assertWorktopContainsNonFungibles(resourceAddress: string, ids: string[]): this;
    popFromAuthZone(callback: (builder: this, proofId: number) => this): this;
    pushToAuthZone(proofId: number): this;
    dropAuthZoneProofs(): this;
    createProofFromAuthZoneOfAmount(resourceAddress: string, amount: Decimal, callback: (builder: this, proofId: number) => this): this;
    createProofFromAuthZoneOfNonFungibles(resourceAddress: string, ids: string[], callback: (builder: this, proofId: number) => this): this;
    createProofFromAuthZoneOfAll(resourceAddress: string, callback: (builder: this, proofId: number) => this): this;
    dropAuthZoneSignatureProofs(): this;
    createProofFromBucketOfAmount(bucketId: number, amount: Decimal, callback: (builder: this, proofId: number) => this): this;
    createProofFromBucketOfNonFungibles(bucketId: number, ids: string[], callback: (builder: this, proofId: number) => this): this;
    createProofFromBucketOfAll(bucketId: number, callback: (builder: this, proofId: number) => this): this;
    burnResource(bucketId: number): this;
    cloneProof(proofId: number, callback: (builder: this, proofId: number) => this): this;
    dropProof(proofId: number): this;
    callFunction(packageAddress: string | number, blueprintName: string, functionName: string, args: Value[]): this;
    callMethod(address: string | number, methodName: string, args: Value[]): this;
    callRoyaltyMethod(address: string | number, methodName: string, args: Value[]): this;
    callMetadataMethod(address: string | number, methodName: string, args: Value[]): this;
    callRoleAssignmentMethod(address: string | number, methodName: string, args: Value[]): this;
    callDirectVaultMethod(address: string, methodName: string, args: Value[]): this;
    dropAllProofs(): this;
    allocateGlobalAddress(packageAddress: string, blueprintName: string): this;
    build(): TransactionManifest;
}
declare type BoolValue = Extract<Value, {
    kind: ValueKind.Bool;
}>;
declare type I8Value = Extract<Value, {
    kind: ValueKind.I8;
}>;
declare type I16Value = Extract<Value, {
    kind: ValueKind.I16;
}>;
declare type I32Value = Extract<Value, {
    kind: ValueKind.I32;
}>;
declare type I64Value = Extract<Value, {
    kind: ValueKind.I64;
}>;
declare type I128Value = Extract<Value, {
    kind: ValueKind.I128;
}>;
declare type U8Value = Extract<Value, {
    kind: ValueKind.U8;
}>;
declare type U16Value = Extract<Value, {
    kind: ValueKind.U16;
}>;
declare type U32Value = Extract<Value, {
    kind: ValueKind.U32;
}>;
declare type U64Value = Extract<Value, {
    kind: ValueKind.U64;
}>;
declare type U128Value = Extract<Value, {
    kind: ValueKind.U128;
}>;
declare type StringValue = Extract<Value, {
    kind: ValueKind.String;
}>;
declare type EnumValue = Extract<Value, {
    kind: ValueKind.Enum;
}>;
declare type ArrayValue = Extract<Value, {
    kind: ValueKind.Array;
}>;
declare type TupleValue = Extract<Value, {
    kind: ValueKind.Tuple;
}>;
declare type MapValue = Extract<Value, {
    kind: ValueKind.Map;
}>;
declare type AddressValue = Extract<Value, {
    kind: ValueKind.Address;
}>;
declare type BucketValue = Extract<Value, {
    kind: ValueKind.Bucket;
}>;
declare type ProofValue = Extract<Value, {
    kind: ValueKind.Proof;
}>;
declare type ExpressionValue = Extract<Value, {
    kind: ValueKind.Expression;
}>;
declare type BlobValue = Extract<Value, {
    kind: ValueKind.Blob;
}>;
declare type DecimalValue = Extract<Value, {
    kind: ValueKind.Decimal;
}>;
declare type PreciseDecimalValue = Extract<Value, {
    kind: ValueKind.PreciseDecimal;
}>;
declare type NonFungibleLocalIdValue = Extract<Value, {
    kind: ValueKind.NonFungibleLocalId;
}>;
declare type AddressReservationValue = Extract<Value, {
    kind: ValueKind.AddressReservation;
}>;
export declare const bool: (value: boolean) => BoolValue;
export declare const i8: (value: number | string) => I8Value;
export declare const i16: (value: number | string) => I16Value;
export declare const i32: (value: number | string) => I32Value;
export declare const i64: (value: number | bigint | string) => I64Value;
export declare const i128: (value: number | bigint | string) => I128Value;
export declare const u8: (value: number | string) => U8Value;
export declare const u16: (value: number | string) => U16Value;
export declare const u32: (value: number | string) => U32Value;
export declare const u64: (value: number | bigint | string) => U64Value;
export declare const u128: (value: number | bigint | string) => U128Value;
export declare const str: (value: string) => StringValue;
export declare const enumeration: (discriminator: number, ...fields: Value[]) => EnumValue;
export declare const array: (elementKind: ValueKind, ...elements: Value[]) => ArrayValue;
export declare const tuple: (...fields: Value[]) => TupleValue;
export declare const map: (keyKind: ValueKind, valueKind: ValueKind, ...entries: [Value, Value][]) => MapValue;
export declare const address: (value: string | number) => AddressValue;
export declare const bucket: (value: number) => BucketValue;
export declare const proof: (value: number) => ProofValue;
export declare const expression: (value: "EntireWorktop" | "EntireAuthZone") => ExpressionValue;
export declare const decimal: (value: number | bigint | string | Decimal) => DecimalValue;
export declare const preciseDecimal: (value: number | bigint | string | Decimal) => PreciseDecimalValue;
export declare const blob: (value: Bytes) => BlobValue;
export declare const nonFungibleLocalId: (value: string) => NonFungibleLocalIdValue;
export declare const addressReservation: (value: number) => AddressReservationValue;
export {};
