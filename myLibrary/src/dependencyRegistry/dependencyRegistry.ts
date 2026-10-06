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

type RegistryMethod = (this: DependencyRegistry) => void;

class DependencyRegistry {
  container: DependencyContainer;

  constructor(
    protected registryMethods: RegistryMethod[] = [],
    protected serviceName = "App",
    protected env = process.env.NODE_ENV ?? "development",
  ) {
    this.container = globalContainer;
    this.serviceName = serviceName;
    this.env = env;

    // Run provided registry methods to configure container
    registryMethods.forEach((method) => method.call(this));
  }

  resolve<T>(token: InjectionToken<T>) {
    return this.container.resolve(token);
  }

  register<T>(token: InjectionToken<T>, provider: ValueProvider<T>): void {
    this.container.register<T>(token, provider);
  }

  registerInstance<T>(token: InjectionToken<T>, instance: T): void {
    this.container.registerInstance<T>(token, instance);
  }
}

export {
  autoInjectable,
  DependencyContainer,
  DependencyRegistry,
  injectable,
  instanceCachingFactory,
  inject as looseInject,
  injectAll as looseInjectAll,
  singleton,
  globalContainer,
};
