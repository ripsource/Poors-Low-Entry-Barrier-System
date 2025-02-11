import { Instruction } from "../../";
export type Instructions = {
    kind: "String";
    value: string;
} | {
    kind: "Parsed";
    value: Instruction[];
};
export declare enum InstructionsKind {
    String = "String",
    Parsed = "Parsed"
}
