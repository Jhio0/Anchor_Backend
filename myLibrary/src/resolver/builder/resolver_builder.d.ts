// ================================
// GraphQL Class Resolver Helper Types
// ================================

/**
 * Generic class constructor type.
 */
export type Constructor<T = any> = new (...args: any[]) => T;

/**
 * Returns the method names of a class instance (excluding "constructor").
 *
 * Example:
 * class UserResolver {
 *   findUser() {}
 *   createUser() {}
 * }
 *
 * const methods = getResolverMethods(UserResolver);
 * // inferred type:
 * // ("findUser" | "createUser")[]
 */
export declare function getResolverMethods<T extends Constructor>(
  ResolverClass: T,
): Array<keyof InstanceType<T>>;

/**
 * Attaches methods from a class instance to a target resolver object.
 * Each method is bound to the instance to preserve `this`.
 *
 * Throws:
 * - If a property is not a function
 * - If duplicate resolver names exist
 *
 * Example:
 * class UserResolver {
 *   findUser() { return "Jhio"; }
 * }
 *
 * const instance = new UserResolver();
 * const target = {};
 *
 * attachMethods(target, ["findUser"], instance, "Query");
 *
 * target.findUser(); // "Jhio"
 */
export declare function attachMethods<T extends object>(
  target: Record<string, (...args: any[]) => any>,
  methods: Array<keyof T>,
  instance: T,
  typeName: string,
): void;

/**
 * Combines multiple resolver classes into a single resolver object
 * for a GraphQL type (Query, Mutation, etc.).
 *
 * Example:
 * class UserResolver {
 *   user() {}
 * }
 *
 * class PostResolver {
 *   posts() {}
 * }
 *
 * const queryResolvers = combineResolverClasses(
 *   [UserResolver, PostResolver],
 *   "Query"
 * );
 *
 * Result:
 * {
 *   user: Function,
 *   posts: Function
 * }
 */
export declare function combineResolverClasses<T extends object>(
  classes: Constructor<T>[],
  typeName: string,
): Record<string, (...args: any[]) => any>;

/**
 * Builds a full GraphQL resolver map from a configuration object.
 *
 * Example:
 *
 * buildResolvers({
 *   Query: [UserResolver, PostResolver],
 *   Mutation: [CreateUserResolver]
 * });
 *
 * Result:
 * {
 *   Query: {
 *     user: Function,
 *     posts: Function
 *   },
 *   Mutation: {
 *     createUser: Function
 *   }
 * }
 */
export declare function buildResolvers(
  resolverConfig: Record<string, Constructor[]>,
): Record<string, Record<string, (...args: any[]) => any>>;
