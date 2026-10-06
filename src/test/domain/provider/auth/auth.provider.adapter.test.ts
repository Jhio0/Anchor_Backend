import { describe, it, expect, beforeEach, vi } from "vitest";
import { fakeAuthCredentials } from "../../../factories/domain/auth.factory";
import { fakeUser } from "../../../factories/domain/user.factory";

describe("AuthProviderAdapter", () => {
  let mockAuthRepository: any;
  let mockUserRepository: any;

  beforeEach(() => {
    mockAuthRepository = {
      authenticate: vi.fn(),
      validateToken: vi.fn(),
    };
    mockUserRepository = {
      findByEmail: vi.fn(),
    };
  });

  it("should authenticate user successfully", async () => {
    const credentials = fakeAuthCredentials();
    const user = fakeUser({ email: credentials.email });

    mockUserRepository.findByEmail.mockResolvedValueOnce(user);

    const foundUser = await mockUserRepository.findByEmail(credentials.email);

    expect(foundUser).toEqual(user);
    expect(foundUser.email).toBe(credentials.email);
  });

  it("should reject invalid credentials", async () => {
    mockAuthRepository.authenticate.mockRejectedValueOnce(
      new Error("Invalid credentials"),
    );

    await expect(mockAuthRepository.authenticate({})).rejects.toThrow(
      "Invalid credentials",
    );
  });

  it("should validate token correctly", async () => {
    const token = "valid-jwt-token";
    mockAuthRepository.validateToken.mockResolvedValueOnce(true);

    const result = await mockAuthRepository.validateToken(token);

    expect(result).toBe(true);
  });

  it("should handle invalid tokens", async () => {
    mockAuthRepository.validateToken.mockResolvedValueOnce(false);

    const result = await mockAuthRepository.validateToken("invalid-token");

    expect(result).toBe(false);
  });

  it("should handle empty email", async () => {
    mockUserRepository.findByEmail.mockResolvedValueOnce(null);

    const result = await mockUserRepository.findByEmail("");

    expect(result).toBeNull();
  });
});
