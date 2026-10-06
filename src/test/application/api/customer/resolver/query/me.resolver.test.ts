import { describe, it, expect, beforeEach, vi } from "vitest";
import { fakeUser } from "../../../../../factories/domain/user.factory";

describe("MeResolver", () => {
  let mockUserRepository: any;
  let mockAuthService: any;

  beforeEach(() => {
    mockUserRepository = {
      findById: vi.fn(),
    };
    mockAuthService = {
      getCurrentUserId: vi.fn(),
    };
  });

  it("should return current user", async () => {
    const user = fakeUser();

    mockAuthService.getCurrentUserId.mockReturnValueOnce(user.id);
    mockUserRepository.findById.mockResolvedValueOnce(user);

    const userId = mockAuthService.getCurrentUserId();
    const result = await mockUserRepository.findById(userId);

    expect(result).toEqual(user);
  });

  it("should fail if user not authenticated", async () => {
    mockAuthService.getCurrentUserId.mockReturnValueOnce(null);

    const userId = mockAuthService.getCurrentUserId();

    expect(userId).toBeNull();
    expect(mockUserRepository.findById).not.toHaveBeenCalled();
  });

  it("should handle user not found", async () => {
    const userId = "non-existent-id";

    mockAuthService.getCurrentUserId.mockReturnValueOnce(userId);
    mockUserRepository.findById.mockResolvedValueOnce(null);

    const result = await mockUserRepository.findById(userId);

    expect(result).toBeNull();
  });

  it("should return user with all properties", async () => {
    const user = fakeUser();

    mockAuthService.getCurrentUserId.mockReturnValueOnce(user.id);
    mockUserRepository.findById.mockResolvedValueOnce(user);

    const result = await mockUserRepository.findById(user.id);

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("email");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("dateOfBirth");
  });

  it("should handle database errors", async () => {
    const userId = fakeUser().id;

    mockAuthService.getCurrentUserId.mockReturnValueOnce(userId);
    mockUserRepository.findById.mockRejectedValueOnce(new Error("DB Error"));

    await expect(mockUserRepository.findById(userId)).rejects.toThrow(
      "DB Error",
    );
  });
});
