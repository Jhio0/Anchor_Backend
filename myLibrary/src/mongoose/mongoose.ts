import mongoose from "mongoose";
import logger from "../logger/logger";
import { MongodbUriParser } from "mongodb-uri";
import { randomUUID } from "crypto";

// Extend mongoose module to add connectionString property
declare module "mongoose" {
  let connectionString: string;
}

export const defaultSchemaSettingsPlugins = (schema: mongoose.Schema) => {
  // Set default options for all schemas
  schema.set("timestamps", true); // Add createdAt/updatedAt
  schema.set("toJSON", { virtuals: true }); // Include virtuals in JSON
  schema.set("toObject", { virtuals: true }); // Include virtuals in objects

  // Add common fields to all schemas
  schema.add({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  // Add common methods
  schema.methods.toSafeObject = function () {
    const obj = this.toObject();
    delete obj.__v; // Remove version key
    return obj;
  };
};

/**
 * Applies default configurations to a mongoose instance
 * @param mongooseInstance The mongoose instance to configure
 */
export const applyDefault = (mongooseIntance: mongoose.Mongoose): void => {
  // Set debug mode based on configuration
  mongooseIntance.set("debug", true);

  // Set up connection event listeners
  mongooseIntance.connection.on("connected", () => {
    logger.info("Mongo Connected");
  });

  mongooseIntance.connection.on("error", (error) => {
    logger.info(error);
    throw new Error(error);
  });

  mongooseIntance.connection.on("disconnected", () => {
    logger.info("DB Disconnected");
  });

  mongooseIntance.plugin(defaultSchemaSettingsPlugins);
};

/**
 * Generates a unique test database connection string
 * @param connectionString The base connection string
 * @param mongoUriParser Optional URI parser instance
 * @returns A connection string with a unique test database name
 */
export const getTestConnectionString = (connectionString: string): string => {
  // Remove options separator for consistent return format
  const uriParser = new MongodbUriParser();
  const mongoUri = uriParser.parse(
    connectionString.endsWith("?")
      ? connectionString.slice(0, -1)
      : connectionString,
  );

  // Generate unique database name using UUID
  mongoUri.database = randomUUID();
  logger.debug("Using test database connection.");

  return uriParser.format(mongoUri);
};

/**
 * Creates a configured mongoose instance
 * @param connectionString The MongoDB connection string
 * @returns A configured mongoose instance
 *
 * @example
 * ```typescript
 * // This must evaluate to true to support the use of a testing-oriented database:
 * process.env.MONGO_URL && process.env.NODE_ENV === 'test'
 * ```
 */
export const createMongoose = (connectionString: string): mongoose.Mongoose => {
  const instance = new mongoose.Mongoose();

  // Set connection string with test database handling
  // Set connection string with test database handling
  instance.connectionString =
    process.env.MONGODB_URI && process.env.NODE_ENV === "test"
      ? getTestConnectionString(process.env.MONGODB_URI)
      : connectionString;

  applyDefault(instance);

  return instance;
};
