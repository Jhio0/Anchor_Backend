import "reflect-metadata";
import { Mongoose } from "mongoose";

import { getDependencyRegistry } from "./configuration/dependency-registry";
import { RedisService } from "myLibrary";
import { RedisTokens } from "./lib/injection-tokens/redis-token";
import { ApolloServer } from "apollo-server";
import { createResolvers } from "./application/api/customer/resolver";
import { typeDefs } from "./application/api/customer/schema/index";
import { buildCustomerContext } from "./lib/buildCustomerContext";

async function initializeRedis(): Promise<void> {
  const dependencyRegistry = getDependencyRegistry();

  const redisService = dependencyRegistry.resolve<RedisService>(
    RedisTokens.RedisService,
  );

  await redisService.connect();

  console.log("✅ Redis connected");
}

function initializeApolloServer(): ApolloServer {
  const resolvers = createResolvers();

  const server = new ApolloServer({
    typeDefs,
    resolvers,

    // Apollo calls buildContext() for every request.
    context: buildCustomerContext,
  });

  return server;
}

async function initializeDatabase(): Promise<Mongoose> {
  const dependencyRegistry = getDependencyRegistry();
  const mongooseInstance = dependencyRegistry.resolve(Mongoose);
  await mongooseInstance.connect(mongooseInstance.connectionString);
  console.log("✅ Database connected");
  return mongooseInstance;
}

async function initializeServer(): Promise<void> {
  try {
    await initializeDatabase();
    await initializeRedis();
    const server = initializeApolloServer();
    const { url } = await server.listen({ port: 5000 });
    console.log(`🚀 Server running at ${url}`);
  } catch (error) {
    console.error("❌ Failed to initialize server:", error);
    process.exit(1);
  }
}

initializeServer();
