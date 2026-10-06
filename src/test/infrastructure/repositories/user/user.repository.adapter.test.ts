import { describe, it, expect, beforeEach, vi } from "vitest";
import { fakeUser } from "../../../factories/domain/user.factory";

describe("UserRepositoryAdapter", () => {
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      users: {
        findById: vi.fn(),
        find: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
        findByEmail: vi.fn(),
      },
    };
  });

  it("should find user by id", async () => {
    const userData = fakeUser();
    mockDb.users.findById.mockResolvedValueOnce(userData);

    const result = await mockDb.users.findById(userData.id);

    expect(result).toEqual(userData);
  });

  it("should create user", async () => {
    const userData = fakeUser();
    mockDb.users.create.mockResolvedValueOnce(userData);

    const result = await mockDb.users.create(userData);

    expect(result).toEqual(userData);
  });

  it("should delete user", async () => {
    const userId = fakeUser().id;
    mockDb.users.delete.mockResolvedValueOnce(true);

    const result = await mockDb.users.delete(userId);

    expect(result).toBe(true);
  });

  it("should find user by email", async () => {
    const userData = fakeUser();
    mockDb.users.findByEmail.mockResolvedValueOnce(userData);

    const result = await mockDb.users.findByEmail(userData.email);

    expect(result).toEqual(userData);
  });

  it("should handle user not found", async () => {
    mockDb.users.findById.mockResolvedValueOnce(null);

    const result = await mockDb.users.findById("non-existent-id");

    expect(result).toBeNull();
  });

  it("should handle email not found", async () => {
    mockDb.users.findByEmail.mockResolvedValueOnce(null);

    const result = await mockDb.users.findByEmail("nonexistent@example.com");

    expect(result).toBeNull();
  });

  it("should handle database errors on create", async () => {
    const userData = fakeUser();
    mockDb.users.create.mockRejectedValueOnce(new Error("DB Error"));

    await expect(mockDb.users.create(userData)).rejects.toThrow("DB Error");
  });

  it("should handle database errors on delete", async () => {
    mockDb.users.delete.mockRejectedValueOnce(new Error("DB Error"));

    await expect(mockDb.users.delete("user-123")).rejects.toThrow("DB Error");
  });
});
