import { Schema, Document } from "mongoose";
import {
  AbstractRepository,
  RepositoryOverrideOptions,
  RepositoryOverrideOptionsRaw,
  RepositoryWithOverridesFactory,
} from "./override-repository";
import { instanceCachingFactory } from "tsyringe";
import { globalContainer } from "../dependencyRegistry/dependencyRegistry";
import { transformAdapterName } from "../helper/TransformAdapterName";

type FactoryReturnType<
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
 * Wraps a _RepositoryAdapter_ class with common functionality:
 * - debug logging for custom methods
 * - DI registration of adapter and its factory
 */
export function RepositoryFactory<
  T extends new (
    ...args: ConstructorParameters<AbstractRepository>
  ) => InstanceType<T>,
  D extends Document,
>(globalOverrides?: RepositoryOverrideOptionsRaw): FactoryReturnType<T, D> {
  return function (
    collectionName: string,
    schema: Schema,
    localOverrides?: RepositoryOverrideOptions<D>,
  ) {
    // Create the factory function
    const factory = RepositoryWithOverridesFactory<T, D>({
      collectionName,
      schema,
      overrides: {
        ...(globalOverrides ?? {}),
        ...(localOverrides ?? {}),
      } as RepositoryOverrideOptions<D>,
    });

    // Return a decorator function that both decorates and registers
    return function (constructor: T) {
      // Register immediately when the class is decorated
      globalContainer.register(transformAdapterName(constructor.name), {
        useFactory: instanceCachingFactory(() => factory(constructor)),
      });

      // Return the decorated class
      return factory(constructor);
    };
  };
}

/**
 * Default repository decorator with auto logger
 * Usage: @Repository('Entity', entitySchema)
 */
export const Repository = RepositoryFactory<any, any>();
