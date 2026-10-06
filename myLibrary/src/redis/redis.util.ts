import { createClient, RedisClientType } from "redis";

export class RedisService {
  private client: RedisClientType;

  constructor(url: string) {
    this.client = createClient({
      url,
    });

    this.client.on("error", (error) => {
      console.error("❌ Redis error:", error);
    });
  }

  /**
   * Connect to Redis.
   */
  async connect(): Promise<void> {
    if (this.client.isOpen) {
      return;
    }

    await this.client.connect();

    console.log("✅ Redis connected");
  }

  /**
   * Store a value in Redis.
   *
   * ttl is in seconds.
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.client.set(
      key,
      JSON.stringify(value),
      ttl ? { EX: ttl } : undefined,
    );
  }

  /**
   * Retrieve a value from Redis.
   */
  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  /**
   * Delete a value from Redis.
   */
  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}
