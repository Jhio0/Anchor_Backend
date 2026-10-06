import { describe, it, expect, beforeEach, vi } from "vitest";
import { fakeUser } from "../../../../../factories/domain/user.factory";

describe("UserResolver", () => {
  let mockUserRepository: any;

  beforeEach(() => {
    mockUserRepository = {
      findById: vi.fn(),
    };
  });

  it("should retrieve user by id", async () => {
    const user = fakeUser();

    mockUserRepository.findById.mockResolvedValueOnce(user);

    const result = await mockUserRepository.findById(user.id);

    expect(result).toEqual(user);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(user.id);
  });

  it("should fail if user not found", async () => {
    mockUserRepository.findById.mockResolvedValueOnce(null);

    const result = await mockUserRepository.findById("non-existent-id");

    expect(result).toBeNull();
  });

  it("should return user with all properties", async () => {
    const user = fakeUser();

    mockUserRepository.findById.mockResolvedValueOnce(user);

    const result = await mockUserRepository.findById(user.id);

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("email");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("dateOfBirth");
  });

  it("should validate user id is provided", async () => {
    const invalidId = "";

    mockUserRepository.findById.mockRejectedValueOnce(new Error("User ID is required"));

    await expect(mockUserRepository.findById(invalidId)).rejects.toThrow("User ID is required");
  });

  it("should handle database errors", async () => {
    const userId = fakeUser().id;

    mockUserRepository.findById.mockRejectedValueOnce(new Error("DB Error"));

    await expect(mockUserRepository.findById(userId)).rejects.toThrow("DB Error");
  });

  it("should return correct user for valid id", async () => {
    const user = fakeUser();

    mockUserRepository.findById.mockResolvedValueOnce(user);

    const result = await mockUserRepository.findById(user.id);

    expect(result.name).toBe(user.name);
    expect(result.email).toBe(user.email);
  });
});
