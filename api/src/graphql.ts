import { createSchema, createYoga } from "graphql-yoga";
import type { AppDatabase } from "./db.js";

export type GraphqlContext = {
  database: AppDatabase;
  requestId: string;
};

export function createFoundationYoga({
  database,
  ping = () => "pong",
}: {
  database: AppDatabase;
  ping?: () => string;
}) {
  return createYoga<{ requestId: string }, GraphqlContext>({
    batching: false,
    cors: false,
    graphiql: false,
    graphqlEndpoint: "/graphql",
    landingPage: false,
    logging: false,
    maskedErrors: {
      errorMessage: "Internal server error",
      isDev: false,
    },
    maxRequestBodySize: 1_048_576,
    multipart: false,
    schema: createSchema({
      resolvers: {
        Query: {
          ping,
        },
      },
      typeDefs: /* GraphQL */ `
        type Query {
          ping: String!
        }
      `,
    }),
    context: ({ requestId }) => ({ database, requestId }),
  });
}
