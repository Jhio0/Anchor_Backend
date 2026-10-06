// repository-factory.d.ts

import { Schema, Document } from "mongoose";
import {
  AbstractRepository,
  RepositoryOverrideOptions,
  RepositoryOverrideOptionsRaw,
} from "./override-repository";

/**
 * Type of the factory function returned by RepositoryFactory.
 */
export type FactoryReturnType<
  T extends new (
    ...args: ConstructorParameters<AbstractRepository>
  ) => InstanceType<T>,
  D extends Document,
> = (
  collectionName: string,
  schema: Schema,
  localOverrides?: RepositoryOverrideOptions<D>,
) => (constructor: T) => InstanceType<T>;

/**
 * Repository decorator factory.
 * Wraps a RepositoryAdapter class with DI registration and logging.
 */
export function RepositoryFactory<
  T extends new (...args: any[]) => any,
  D extends Document,
>(globalOverrides?: RepositoryOverrideOptionsRaw): FactoryReturnType<T, D>;

/**
 * Default repository decorator with auto logger.
 * Usage: @Repository('Entity', entitySchema)
 */
export const Repository: FactoryReturnType<any, any>;
