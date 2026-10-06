import { Mongoose, Model, Schema, Document } from "mongoose";
import {
  autoInjectable,
  DependencyContainer,
  globalContainer,
  instanceCachingFactory,
} from "../dependencyRegistry/dependencyRegistry";
import { BaseRepository } from "../baseRepository/baseRepository";
import logger from "../logger/logger";

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never } & Partial<
  Record<keyof U, never>
>;

/** Exclusive OR (XOR) between two object types */
export type Either<T, U> = (T & Without<U, T>) | (U & Without<T, U>);

export type RepositoryOverrideOptionsRaw = {
  mongoose?: () => Mongoose;
  databaseName?: string;
  onUpdateSetUndefinedToNull?: boolean;
};

export interface RepositoryOverrideOptionsModel<D extends Document> {
  model: (container: DependencyContainer) => Model<D>;
}

export type RepositoryOverrideOptions<D extends Document> = Either<
  RepositoryOverrideOptionsRaw,
  RepositoryOverrideOptionsModel<D>
>;

export interface RepositoryWithOverridesFactoryInputs<D extends Document> {
  collectionName: string;
  schema: Schema;
  overrides?: RepositoryOverrideOptions<D>;
  // hooks?: HooksClass<any, ChangeCallbacks<any>>;
}

export type AbstractRepository = typeof BaseRepository<any, any, any, any, any>;

export function RepositoryWithOverridesFactory<
  T extends new (
    ...args: ConstructorParameters<AbstractRepository>
  ) => InstanceType<T>,
  D extends Document,
>({
  collectionName,
  schema,
  overrides,
}: RepositoryWithOverridesFactoryInputs<D>) {
  return function (constructor: T): InstanceType<T> {
    const { mongoose, model, databaseName, onUpdateSetUndefinedToNull } =
      (overrides || {}) as RepositoryOverrideOptionsRaw &
        Partial<RepositoryOverrideOptionsModel<D>>;

    const classConstructor = autoInjectable()(
      constructor as new (...args: any[]) => InstanceType<T>,
    );

    logger.debug(`Loaded ${constructor.name}`);

    // Get the registry and its container

    const dependencyContainer = globalContainer;

    //Transform exampl "Page" to "PageRepository" when registering
    const token = `${collectionName}Repository`;

    //registering in tsyringe
    dependencyContainer.register(token, {
      useFactory: instanceCachingFactory(() => {
        if (model) {
          const args = {
            model: model(dependencyContainer),
          } as unknown as ConstructorParameters<T>[0];

          return new constructor(args);
        }

        if (!collectionName || !schema) {
          throw new Error(
            "When no `model` field is provided, a `collectionName` and a `schema` needs to be passed in",
          );
        }

        // prefer override mongoose(), otherwise resolve Mongoose from the active container
        const resolvedMongoose = mongoose
          ? mongoose()
          : dependencyContainer.resolve(Mongoose); // Use the same container here

        const mongooseInstance = databaseName
          ? resolvedMongoose.connection.useDb(databaseName)
          : resolvedMongoose;

        const modelInstance = mongooseInstance.model(collectionName, schema);

        const args = {
          model: modelInstance,
          options: { onUpdateSetUndefinedToNull: onUpdateSetUndefinedToNull },
        } as unknown as ConstructorParameters<T>[0];

        return new constructor(args);
      }),
    });
    Object.defineProperty(classConstructor, "name", {
      value: constructor.name,
    });

    return classConstructor as InstanceType<T>;
  };
}
