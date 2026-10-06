import { DependencyRegistry } from "myLibrary";
import { registerRepositorys } from "./dependency-registries/repositorys";
import { registerProviders } from "./dependency-registries/providers";
import { registerRedis } from "./dependency-registries/redis";

let dependencyRegistry: DependencyRegistry;

const getDependencyRegistry = (): DependencyRegistry => {
  if (!dependencyRegistry) {
    dependencyRegistry = new DependencyRegistry([
      registerRepositorys,
      registerProviders,
      registerRedis,
    ]);
  }
  return dependencyRegistry;
};

export { getDependencyRegistry };
