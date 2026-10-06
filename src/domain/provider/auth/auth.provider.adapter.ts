import bcrypt from "bcryptjs";
import crypto from "crypto";
import { inject } from "tsyringe";

import { Provider, RedisService } from "myLibrary";

import {
  AuthPayload,
  AuthProviderPort,
  CurrentUser,
  LoginInput,
  SignupInput,
} from "./auth.provider.port";

import { RepositoryTokens } from "../../../lib/injection-tokens/repository-tokens";
import { UserRepositoryPort } from "../../repository/user.repository.port";
import { RedisTokens } from "../../../lib/injection-tokens/redis-token";

@Provider
export class AuthProviderAdapter implements AuthProviderPort {
  constructor(
    @inject(RepositoryTokens.UserRepository)
    private userRepositoryPort: UserRepositoryPort,
    @inject(RedisTokens.RedisService)
    private redisService: RedisService,
  ) {}

  /**
   * Creates a Redis session for an authenticated user.
   *
   * Redis stores:
   *
   * session:<sessionId> -> { userId }
   *
   * The session automatically expires after 7 days.
   */
  private async createSession(userId: string): Promise<string> {
    // Generate a random session ID.
    const sessionId = crypto.randomUUID();

    // Store the user ID associated with this session.
    await this.redisService.set(
      `session:${sessionId}`,
      { userId },
      60 * 60 * 24 * 7, // 7 days
    );

    return sessionId;
  }

  /**
   * Gets the authenticated user associated with a session.
   *
   * Redis is the source of truth for whether the session
   * currently exists.
   *
   * Returns null when:
   * - The session does not exist.
   * - The session expired.
   * - The session was deleted during logout.
   */
  async getCurrentUser(sessionId: string): Promise<CurrentUser | null> {
    // Look up the session in Redis.
    const session = await this.redisService.get<{
      userId: string;
    }>(`session:${sessionId}`);

    // No session means the request is unauthenticated.
    if (!session) {
      return null;
    }

    // The session exists, so we know which user
    // authenticated this request.
    return {
      userId: session.userId,
    };
  }

  async signup(input: SignupInput): Promise<AuthPayload> {
    // Hash the password before storing it in MongoDB.
    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = await this.userRepositoryPort.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      dateOfBirth: new Date(input.dateOfBirth),
    });

    // Create a session after successful signup.
    const sessionId = await this.createSession(user.id);

    return {
      sessionId,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        dateOfBirth: new Date(user.dateOfBirth).toISOString(),
      },
    };
  }

  async login(input: LoginInput): Promise<AuthPayload> {
    // Find the user in MongoDB.
    const user = await this.userRepositoryPort.findByEmail(input.email);

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    if (!user.password) {
      throw new Error("Invalid email or password.");
    }

    // Compare the plain-text password against
    // the bcrypt hash stored in MongoDB.
    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    // Credentials are valid, so create a Redis session.
    const sessionId = await this.createSession(user.id);

    return {
      sessionId,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        dateOfBirth: new Date(user.dateOfBirth).toISOString(),
      },
    };
  }
}
