// mongoose-utils.d.ts

import mongoose from "mongoose";

/**
 * Applies default plugins and schema settings to a Mongoose schema
 * @param schema The Mongoose schema to configure
 */
export declare const defaultSchemaSettingsPlugins: (
  schema: mongoose.Schema,
) => void;

/**
 * Applies default configuration to a Mongoose instance
 * @param mongooseInstance The mongoose instance to configure
 */
export declare const applyDefault: (
  mongooseInstance: mongoose.Mongoose,
) => void;

/**
 * Generates a unique test database connection string from a base string
 * @param connectionString The base MongoDB connection string
 * @returns A modified connection string with a unique test database name
 */
export declare const getTestConnectionString: (
  connectionString: string,
) => string;

/**
 * Creates a fully configured Mongoose instance with default plugins
 * and optional test database handling
 * @param connectionString The MongoDB connection string
 * @returns Configured Mongoose instance
 */
export declare const createMongoose: (
  connectionString: string,
) => mongoose.Mongoose;
