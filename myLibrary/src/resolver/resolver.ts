import {
  globalContainer,
  injectable,
  instanceCachingFactory,
} from "../dependencyRegistry/dependencyRegistry";

type Constructor<T = any> = new (...args: any[]) => T;

/*
ResolverFactory()

Creates the @Resolver() decorator used to register GraphQL
resolver classes in the dependency injection container.

What it does:

1. Marks the class as injectable
2. Registers it in the DI container
3. Enables dependency injection for resolver constructors
4. Ensures the resolver instance is cached

Example:

@Resolver()
class UserResolver {
  constructor(private repo: UserRepository) {}
}
*/
export function ResolverFactory() {
  return function <T extends Constructor>(constructor: T): T {
    injectable()(constructor);

    const token = constructor.name;

    globalContainer.register(token, {
      useFactory: instanceCachingFactory((container) => {
        return container.resolve(constructor);
      }),
    });

    return constructor;
  };
}

export const Resolver = ResolverFactory();
