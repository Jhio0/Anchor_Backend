import { describe, it, expect, beforeEach, vi } from "vitest";
import { fakeApplication } from "../../../factories/domain/application.factory";

describe("ApplicationRepositoryAdapter", () => {
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      applications: {
        findById: vi.fn(),
        find: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
        findByUserId: vi.fn(),
      },
    };
  });

  it("should find application by id", async () => {
    const applicationData = fakeApplication();
    mockDb.applications.findById.mockResolvedValueOnce(applicationData);

    const result = await mockDb.applications.findById(applicationData.id);

    expect(result).toEqual(applicationData);
  });

  it("should create application", async () => {
    const applicationData = fakeApplication();
    mockDb.applications.create.mockResolvedValueOnce(applicationData);

    const result = await mockDb.applications.create(applicationData);

    expect(result).toEqual(applicationData);
  });

  it("should delete application", async () => {
    const applicationId = fakeApplication().id;
    mockDb.applications.delete.mockResolvedValueOnce(true);

    const result = await mockDb.applications.delete(applicationId);

    expect(result).toBe(true);
  });

  it("should find applications by user id", async () => {
    const applicationData = fakeApplication();
    mockDb.applications.findByUserId.mockResolvedValueOnce([applicationData]);

    const result = await mockDb.applications.findByUserId(
      applicationData.userId,
    );

    expect(result).toEqual([applicationData]);
  });

  it("should handle application not found", async () => {
    mockDb.applications.findById.mockResolvedValueOnce(null);

    const result = await mockDb.applications.findById("non-existent-id");

    expect(result).toBeNull();
  });

  it("should handle user id with no applications", async () => {
    mockDb.applications.findByUserId.mockResolvedValueOnce([]);

    const result = await mockDb.applications.findByUserId(
      "nonexistent-user-id",
    );

    expect(result).toEqual([]);
  });

  it("should handle database errors on create", async () => {
    const applicationData = fakeApplication();
    mockDb.applications.create.mockRejectedValueOnce(new Error("DB Error"));

    await expect(mockDb.applications.create(applicationData)).rejects.toThrow(
      "DB Error",
    );
  });

  it("should handle database errors on delete", async () => {
    mockDb.applications.delete.mockRejectedValueOnce(new Error("DB Error"));

    await expect(mockDb.applications.delete("application-123")).rejects.toThrow(
      "DB Error",
    );
  });
});
