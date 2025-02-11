import { Instruction, Value } from "..";
export type Bytes = Uint8Array | string;
export declare const resolveBytes: (bytes: Bytes) => Uint8Array;
export declare const resolveBytesAndCheckLength: (bytes: Bytes, expectedLength: number) => Uint8Array;
export declare const destructManifestValueTuple: (value: Value) => Value[];
export declare const isLockFeeCallMethod: (instruction: Extract<Instruction, {
    kind: "CallMethod";
}>, faucetComponentAddress: string) => Promise<boolean>;
export declare const isFreeXrdCallMethod: (instruction: Extract<Instruction, {
    kind: "CallMethod";
}>, faucetComponentAddress: string) => Promise<boolean>;
export declare const isAccountWithdrawCallMethod: (instruction: Extract<Instruction, {
    kind: "CallMethod";
}>) => Promise<boolean>;
export declare const isAccountDepositCallMethod: (instruction: Extract<Instruction, {
    kind: "CallMethod";
}>) => Promise<boolean>;
export declare const castValue: <T = import("..").ValueKind>(value: Value, kind: T) => Extract<{
    kind: import("..").ValueKind.Bool;
    value: boolean;
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.I8;
    value: number;
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.I16;
    value: number;
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.I32;
    value: number;
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.I64;
    value: bigint;
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.I128;
    value: bigint;
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.U8;
    value: number;
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.U16;
    value: number;
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.U32;
    value: number;
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.U64;
    value: bigint;
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.U128;
    value: bigint;
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.String;
    value: string;
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.Enum;
    discriminator: number;
    fields: Value[];
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.Array;
    elementValueKind: import("..").ValueKind;
    elements: Value[];
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.Tuple;
    fields: Value[];
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.Map;
    keyValueKind: import("..").ValueKind;
    valueValueKind: import("..").ValueKind;
    entries: import("..").MapEntry[];
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.Address;
    value: import("..").ManifestAddress;
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.Bucket;
    value: number;
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.Proof;
    value: number;
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.Expression;
    value: import("..").Expression;
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.Blob;
    value: Uint8Array;
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.Decimal;
    value: import("decimal.js").default;
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.PreciseDecimal;
    value: import("decimal.js").default;
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.NonFungibleLocalId;
    value: string;
}, {
    kind: T;
}> | Extract<{
    kind: import("..").ValueKind.AddressReservation;
    value: number;
}, {
    kind: T;
}>;
