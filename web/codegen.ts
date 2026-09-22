import { buildSchema } from "graphql";
import type { CodegenConfig } from "@graphql-codegen/cli";
import { authTypeDefs } from "../api/src/auth/schema.js";

const config: CodegenConfig = {
  schema: buildSchema(authTypeDefs),
  documents: ["src/operations/*.graphql"],
  generates: { "src/generated/": { preset: "client", plugins: [] } },
};

export default config;
