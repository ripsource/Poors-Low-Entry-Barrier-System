/**
 * Hashes some byte array of data through the Blake 2b algorithm producing 32-byte long hash digests
 * which follows the hashing algorithm used in Scrypto and the Radix Engine.
 * @param data The data to hash.
 * @returns The hash of the data.
 */
export declare const hash: (data: Uint8Array) => Uint8Array;
export declare const generateRandomNonce: () => number;
