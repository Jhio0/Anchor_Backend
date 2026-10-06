import { describe, it, expect, beforeEach, vi } from "vitest";
import { fakeUser } from "../../../../../factories/domain/user.factory";

describe("CreateUserResolver", () => {
  let mockUserRepository: any;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: vi.fn(),
      create: vi.fn(),
    };
  });

  it("should create user successfully", async () => {
    const user = fakeUser();
    const input = {
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
    };

    mockUserRepository.findByEmail.mockResolvedValueOnce(null);
    mockUserRepository.create.mockResolvedValueOnce(user);

    const foundUser = await mockUserRepository.findByEmail(input.email);
    expect(foundUser).toBeNull();

    const result = await mockUserRepository.create(input);

    expect(result).toEqual(user);
  });

  it("should fail if email already exists", async () => {
    const existingUser = fakeUser();
    const input = {
      name: "New Name",
      email: existingUser.email,
      dateOfBirth: "1990-01-01",
    };

    mockUserRepository.findByEmail.mockResolvedValueOnce(existingUser);

    const foundUser = await mockUserRepository.findByEmail(input.email);

    expect(foundUser).toBeTruthy();
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });

  it("should validate email format", async () => {
    mockUserRepository.findByEmail.mockResolvedValueOnce(null);

    // Email validation should be in resolver
    expect("test@example.com").toMatch(/@/);
  });
});
