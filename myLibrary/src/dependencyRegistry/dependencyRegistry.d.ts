// dependencyRegistry.d.ts

import {
  autoInjectable,
  DependencyContainer,
  inject,
  injectable,
  injectAll,
  InjectionToken,
  instanceCachingFactory,
  singleton,
  ValueProvider,
  container as globalContainer,
} from "tsyringe";

/**
 * Type for a registry method, bound to a DependencyContainer context
 */
export type RegistryMethod = (this: DependencyContainer) => void;

/**
 * Class for managing dependency registration using tsyringe
 */
export declare class DependencyRegistry {
  container: DependencyContainer;

  constructor(
    registryMethods?: RegistryMethod[],
    serviceName?: string,
    env?: string,
  );

  /**
   * Resolves a dependency from the container
   * @param token Injection token
   */
  resolve<T>(token: InjectionToken<T>): T;

  /**
   * Registers a provider in the container
   * @param token Injection token
   * @param provider Value provider for the token
   */
  register<T>(token: InjectionToken<T>, provider: ValueProvider<T>): void;

  /**
   * Registers an instance in the container
   * @param token Injection token
   * @param instance The instance to register
   */
  registerInstance<T>(token: InjectionToken<T>, instance: T): void;
}

// Re-export tsyringe helpers with optional aliasing
export {
  autoInjectable,
  DependencyContainer,
  injectable,
  instanceCachingFactory,
  singleton,
  globalContainer,
  inject as looseInject,
  injectAll as looseInjectAll,
};
