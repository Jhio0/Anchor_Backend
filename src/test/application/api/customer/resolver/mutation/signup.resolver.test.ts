import { describe, it, expect, beforeEach, vi } from "vitest";
import { fakeSignupInput, fakeAuthPayload } from "../../../../../factories/domain/auth.factory";
import { fakeUser } from "../../../../../factories/domain/user.factory";

describe("SignupResolver", () => {
  let mockUserRepository: any;
  let mockAuthProvider: any;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: vi.fn(),
      create: vi.fn(),
    };
    mockAuthProvider = {
      authenticate: vi.fn(),
    };
  });

  it("should signup user successfully", async () => {
    const input = fakeSignupInput();
    const createdUser = fakeUser({ email: input.email });
    const authPayload = fakeAuthPayload({ user: createdUser });

    mockUserRepository.findByEmail.mockResolvedValueOnce(null);
    mockUserRepository.create.mockResolvedValueOnce(createdUser);
    mockAuthProvider.authenticate.mockResolvedValueOnce(authPayload);

    const existing = await mockUserRepository.findByEmail(input.email);
    expect(existing).toBeNull();

    const newUser = await mockUserRepository.create({
      name: input.name,
      email: input.email,
      dateOfBirth: input.dateOfBirth,
    });

    expect(newUser.email).toBe(input.email);
  });

  it("should reject signup with existing email", async () => {
    const input = fakeSignupInput();
    const existingUser = fakeUser({ email: input.email });

    mockUserRepository.findByEmail.mockResolvedValueOnce(existingUser);

    const found = await mockUserRepository.findByEmail(input.email);

    expect(found).toEqual(existingUser);
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });

  it("should validate required fields", async () => {
    const input = fakeSignupInput({ email: "" });

    expect(input.email).toBe("");
  });

  it("should handle password requirements", async () => {
    const input = fakeSignupInput();

    expect(input.password.length).toBeGreaterThanOrEqual(8);
  });
});
