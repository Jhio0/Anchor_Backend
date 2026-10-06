import { DependencyRegistry, RedisService } from "myLibrary";
import { RedisTokens } from "../../lib/injection-tokens/redis-token";

export function registerRedis(this: DependencyRegistry): void {
  const redisService = new RedisService(process.env.REDIS_URL!);

  this.register(RedisTokens.RedisService, {
    useValue: redisService,
  });
}
