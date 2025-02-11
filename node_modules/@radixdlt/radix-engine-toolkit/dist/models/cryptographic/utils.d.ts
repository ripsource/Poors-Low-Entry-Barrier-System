export type Bytes = Uint8Array | string;
export declare const resolveBytes: (bytes: Bytes) => Uint8Array;
export declare const resolveBytesAndCheckLength: (bytes: Bytes, expectedLength: number) => Uint8Array;
