import {
  globalContainer,
  injectable,
  instanceCachingFactory,
} from "../dependencyRegistry/dependencyRegistry";
import logger from "../logger/logger";

type Constructor<T = any> = new (...args: any[]) => T;

export function ProviderFactory() {
  return function <T extends Constructor>(constructor: T): T {
    injectable()(constructor);

    logger.debug(`Loaded ${constructor.name}`);

    const token = constructor.name;

    globalContainer.register(token, {
      useFactory: instanceCachingFactory((container) => {
        return container.resolve(constructor);
      }),
    });

    return constructor;
  };
}

export const Provider = ProviderFactory();
