export type ManifestAddress = {
    kind: "Static";
    value: string;
} | {
    kind: "Named";
    value: number;
};
