// ================================
// GraphQL Class Resolver Builder
// ================================

/*
This module converts class-based resolvers into the object format
expected by GraphQL servers such as Apollo Server.

GraphQL expects resolvers like:

{
  Query: {
    user: () => {}
  },
  Mutation: {
    createUser: () => {}
  }
}

Instead of manually writing that structure, this helper allows
developers to define resolvers as classes.

Example:

@Resolver()
class UserResolver {
  user() {}
}

Then buildResolvers() automatically converts those classes into
a GraphQL resolver map.
*/

import { globalContainer } from "../../dependencyRegistry/dependencyRegistry";

type Constructor<T = any> = new (...args: any[]) => T;

/*
getResolverMethods()

Purpose:
Extract all method names from a resolver class prototype
excluding the constructor.

Why:
GraphQL resolvers are just functions. When using classes we need
to discover which methods exist so they can be attached to the
GraphQL resolver object.

Example:

class UserResolver {
  user() {}
  users() {}
}

Result:
["user", "users"]
*/
export function getResolverMethods<T extends Constructor>(
  ResolverClass: T,
): Array<keyof InstanceType<T>> {
  return Object.getOwnPropertyNames(ResolverClass.prototype).filter(
    (m) => m !== "constructor",
  ) as Array<keyof InstanceType<T>>;
}

/*
attachMethods()

Purpose:
Attach resolver methods from a class instance onto the final
GraphQL resolver object.

Important detail:
Methods are bound to the instance to preserve `this`, because
GraphQL calls resolver functions without class context.

Example result:

{
  user: instance.user.bind(instance)
}
*/
export function attachMethods<T extends object>(
  target: Record<string, (...args: any[]) => any>,
  methods: Array<keyof T>,
  instance: T,
  typeName: string,
): void {
  for (const method of methods) {
    const fn = instance[method];

    if (typeof fn !== "function") {
      throw new Error(
        `Property ${String(method)} on ${typeName} is not a function`,
      );
    }

    if (target[method as string]) {
      throw new Error(`Duplicate resolver ${typeName}.${String(method)}`);
    }

    target[method as string] = fn.bind(instance);
  }
}

/*
combineResolverClasses()

Purpose:
Combine multiple resolver classes into a single resolver object
for a specific GraphQL type (Query, Mutation, etc).

Flow:
1. Resolve each resolver instance from the DI container
2. Extract the resolver methods
3. Attach them to the GraphQL resolver map

Dependency Injection happens here via globalContainer.resolve().

Example input:
[UserResolver, PostResolver]

Example output:
{
  user: fn,
  users: fn,
  posts: fn
}
*/
export function combineResolverClasses<T extends object>(
  classes: Constructor<T>[],
  typeName: string,
): Record<string, (...args: any[]) => any> {
  const typeResolvers: Record<string, (...args: any[]) => any> = {};

  for (const ResolverClass of classes) {
    const token = ResolverClass.name;

    const instance = globalContainer.resolve<T>(token);

    const methods = getResolverMethods(ResolverClass);

    attachMethods(typeResolvers, methods, instance, typeName);
  }

  return typeResolvers;
}

/*
buildResolvers()

Purpose:
Construct the final GraphQL resolver map used by Apollo Server.

Input format:

{
  Query: [UserResolver],
  Mutation: [CreateUserResolver]
}

Output format:

{
  Query: { user: fn },
  Mutation: { createUser: fn }
}

Each GraphQL type is processed independently using
combineResolverClasses().
*/
export function buildResolvers(
  resolverConfig: Record<string, Constructor[]>,
): Record<string, Record<string, (...args: any[]) => any>> {
  const finalResolvers: Record<
    string,
    Record<string, (...args: any[]) => any>
  > = {};

  for (const typeName in resolverConfig) {
    const resolverClasses = resolverConfig[typeName];

    finalResolvers[typeName] = combineResolverClasses(
      resolverClasses,
      typeName,
    );
  }

  return finalResolvers;
}
