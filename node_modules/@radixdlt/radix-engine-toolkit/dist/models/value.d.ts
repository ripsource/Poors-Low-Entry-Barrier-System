import Decimal from "decimal.js";
import { ManifestAddress } from "../index";
export type Value = {
    kind: ValueKind.Bool;
    value: boolean;
} | {
    kind: ValueKind.I8;
    value: number;
} | {
    kind: ValueKind.I16;
    value: number;
} | {
    kind: ValueKind.I32;
    value: number;
} | {
    kind: ValueKind.I64;
    value: bigint;
} | {
    kind: ValueKind.I128;
    value: bigint;
} | {
    kind: ValueKind.U8;
    value: number;
} | {
    kind: ValueKind.U16;
    value: number;
} | {
    kind: ValueKind.U32;
    value: number;
} | {
    kind: ValueKind.U64;
    value: bigint;
} | {
    kind: ValueKind.U128;
    value: bigint;
} | {
    kind: ValueKind.String;
    value: string;
} | {
    kind: ValueKind.Enum;
    discriminator: number;
    fields: Value[];
} | {
    kind: ValueKind.Array;
    elementValueKind: ValueKind;
    elements: Value[];
} | {
    kind: ValueKind.Tuple;
    fields: Value[];
} | {
    kind: ValueKind.Map;
    keyValueKind: ValueKind;
    valueValueKind: ValueKind;
    entries: MapEntry[];
} | {
    kind: ValueKind.Address;
    value: ManifestAddress;
} | {
    kind: ValueKind.Bucket;
    value: number;
} | {
    kind: ValueKind.Proof;
    value: number;
} | {
    kind: ValueKind.Expression;
    value: Expression;
} | {
    kind: ValueKind.Blob;
    value: Uint8Array;
} | {
    kind: ValueKind.Decimal;
    value: Decimal;
} | {
    kind: ValueKind.PreciseDecimal;
    value: Decimal;
} | {
    kind: ValueKind.NonFungibleLocalId;
    value: string;
} | {
    kind: ValueKind.AddressReservation;
    value: number;
};
export declare enum ValueKind {
    Bool = "Bool",
    I8 = "I8",
    I16 = "I16",
    I32 = "I32",
    I64 = "I64",
    I128 = "I128",
    U8 = "U8",
    U16 = "U16",
    U32 = "U32",
    U64 = "U64",
    U128 = "U128",
    String = "String",
    Enum = "Enum",
    Array = "Array",
    Tuple = "Tuple",
    Map = "Map",
    Address = "Address",
    Bucket = "Bucket",
    Proof = "Proof",
    Expression = "Expression",
    Blob = "Blob",
    Decimal = "Decimal",
    PreciseDecimal = "PreciseDecimal",
    NonFungibleLocalId = "NonFungibleLocalId",
    AddressReservation = "AddressReservation"
}
export interface MapEntry {
    key: Value;
    value: Value;
}
export declare enum Expression {
    EntireWorktop = "EntireWorktop",
    EntireAuthZone = "EntireAuthZone"
}
