import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import { Prisma } from "generated/prisma-client";
import { importSchema } from "graphql-import";
import path from "path";
import express from "express";

import { Resolvers } from "generated/types";
import {
  deviceQueries,
  deviceResolvers,
  recordQueries,
  recordsMutations
} from "resolvers";

const resolvers: Resolvers = {
  Query: {
    ...deviceQueries,
    ...recordQueries
  },

  Mutation: {
    ...recordsMutations
  },

  Device: {
    ...deviceResolvers
  }
};

const prisma = new Prisma({
  endpoint: process.env.PRISMA_ENDPOINT as string,
  debug: Boolean(process.env.PRISMA_DEBUG)
});

const schema = makeExecutableSchema({
  typeDefs: importSchema(path.resolve("src/schema.graphql")),
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  }
});

const app = express();

const server = new ApolloServer({
  schema,
  context: ctx => ({
    ...ctx,
    prisma
  })
});

const gqlPath = "/";

server.applyMiddleware({ app, path: gqlPath });

const port = process.env.PORT || 3000;

app.listen(
  {
    port,
    bodyParserOptions: { limit: "25mb", type: "application/json" }
  },
  () => console.log(`GraphQL server is running on http://localhost:${port}`)
);
