import { BaseRepositoryPort } from "myLibrary";
import { CollectedExpenseData } from "../entities/collected-expsense-data";

export type CreateCollectedExpenseData = Omit<CollectedExpenseData, "id">;

export type UpdateCollectedExpenseData = Omit<
  CollectedExpenseData,
  "id" | "userId" | "applicationId"
>;

interface CollectedExpenseRepositoryPort extends Pick<
  BaseRepositoryPort<
    CollectedExpenseData,
    CreateCollectedExpenseData,
    UpdateCollectedExpenseData
  >,
  "create" | "delete" | "find" | "updateOne" | "findById"
> {
  findByUserId(userId: string): Promise<CollectedExpenseData>;
}

export { CollectedExpenseRepositoryPort };
