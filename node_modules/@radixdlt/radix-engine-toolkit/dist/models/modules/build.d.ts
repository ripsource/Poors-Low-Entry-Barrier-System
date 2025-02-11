export interface BuildInformation {
    version: string;
    scryptoDependency: ScryptoDependencyInformation;
}
export type ScryptoDependencyInformation = {
    kind: "Version";
    value: string;
} | {
    kind: "Tag";
    value: string;
} | {
    kind: "Branch";
    value: string;
} | {
    kind: "Rev";
    value: string;
};
