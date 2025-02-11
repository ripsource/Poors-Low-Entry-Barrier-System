export type StaticValidationResult = {
    kind: "Valid";
} | {
    kind: "Invalid";
    error: string;
};
export declare enum SerializationMode {
    Programmatic = "Programmatic",
    Model = "Model",
    Natural = "Natural"
}
export declare enum ManifestSborStringRepresentation {
    ManifestString = "ManifestString",
    ProgrammaticJson = "ProgrammaticJson",
    ModelJson = "ModelJson",
    NaturalJson = "NaturalJson"
}
