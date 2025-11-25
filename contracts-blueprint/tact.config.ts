import { CompilerConfig } from "@ton/blueprint";

const compile: CompilerConfig = {
  lang: "tact",
  targets: ["contracts/STARToken.tact"],
  output: "wrappers"
};

export default compile;
