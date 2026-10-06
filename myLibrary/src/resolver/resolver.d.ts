export type Constructor<T = any> = new (...args: any[]) => T;

/**
 * Marks a class as a GraphQL resolver and registers it
 * in the dependency injection container.
 *
 * Example:
 *
 * @Resolver()
 * class UserResolver {
 *   user() {}
 * }
 */
export declare function ResolverFactory(): <T extends Constructor>(
  constructor: T,
) => T;

/**
 * Decorator used to mark a class as a GraphQL resolver.
 */
export declare const Resolver: <T extends Constructor>(constructor: T) => T;
