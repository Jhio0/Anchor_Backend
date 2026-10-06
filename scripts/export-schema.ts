import fs from "fs";
import { printSchema } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "../src/application/api/customer/schema/index";
// Build schema in memory
const schema = makeExecutableSchema({ typeDefs });

// Write to disk
fs.writeFileSync("graphql/customerSchema.graphql", printSchema(schema));

console.log("✅ schema.graphql exported!");
