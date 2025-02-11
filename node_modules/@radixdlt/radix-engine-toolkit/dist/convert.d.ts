import Decimal from "decimal.js";
export declare class Convert {
    static String: {
        new (): {};
        toNumber: (str: string) => number;
        toBigInt: (str: string) => bigint;
        toDecimal: (str: string) => Decimal;
    };
    static Number: {
        new (): {};
        toString: (num: number) => string;
    };
    static Uint8Array: {
        new (): {};
        toHexString: (array: Uint8Array) => string;
    };
    static HexString: {
        new (): {};
        toUint8Array: (str: string) => Uint8Array;
    };
    static BigInt: {
        new (): {};
        toString: (num: bigint) => string;
    };
    static Decimal: {
        new (): {};
        toString: (num: Decimal) => string;
    };
}
