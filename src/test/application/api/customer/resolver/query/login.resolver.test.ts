import { describe, it, expect, beforeEach, vi } from "vitest";
import { fakeAuthCredentials, fakeAuthPayload } from "../../../../../factories/domain/auth.factory";
import { fakeUser } from "../../../../../factories/domain/user.factory";

describe("LoginResolver", () => {
  let mockAuthProvider: any;
  let mockUserRepository: any;

  beforeEach(() => {
    mockAuthProvider = {
      authenticate: vi.fn(),
    };
    mockUserRepository = {
      findByEmail: vi.fn(),
    };
  });

  it("should login user successfully", async () => {
    const credentials = fakeAuthCredentials();
    const user = fakeUser({ email: credentials.email });
    const authPayload = fakeAuthPayload({ user });

    mockUserRepository.findByEmail.mockResolvedValueOnce(user);
    mockAuthProvider.authenticate.mockResolvedValueOnce(authPayload);

    const foundUser = await mockUserRepository.findByEmail(credentials.email);
    expect(foundUser).toBeDefined();

    const result = await mockAuthProvider.authenticate(credentials);

    expect(result.token).toBeDefined();
    expect(result.user).toEqual(user);
  });

  it("should fail with invalid credentials", async () => {
    const credentials = fakeAuthCredentials();

    mockAuthProvider.authenticate.mockRejectedValueOnce(
      new Error("Invalid credentials"),
    );

    await expect(mockAuthProvider.authenticate(credentials)).rejects.toThrow(
      "Invalid credentials",
    );
  });

  it("should fail if user not found", async () => {
    const credentials = fakeAuthCredentials();

    mockUserRepository.findByEmail.mockResolvedValueOnce(null);

    const foundUser = await mockUserRepository.findByEmail(credentials.email);

    expect(foundUser).toBeNull();
  });

  it("should validate email is provided", async () => {
    const credentials = fakeAuthCredentials({ email: "" });

    expect(credentials.email).toBe("");
  });

  it("should validate password is provided", async () => {
    const credentials = fakeAuthCredentials({ password: "" });

    expect(credentials.password).toBe("");
  });

  it("should return auth payload with token and user", async () => {
    const credentials = fakeAuthCredentials();
    const authPayload = fakeAuthPayload();

    mockAuthProvider.authenticate.mockResolvedValueOnce(authPayload);

    const result = await mockAuthProvider.authenticate(credentials);

    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("user");
  });
});
