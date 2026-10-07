import { BaseRepositoryPort } from "myLibrary";
import {
  CollectedExpenseData,
  ExpenseItems,
  ExpenseSource,
} from "../entities/collected-expsense-data";

export type CreateCollectedExpenseData = Omit<CollectedExpenseData, "id">;

export type UpdateCollectedExpenseData = Omit<
  CollectedExpenseData,
  "id" | "userId" | "applicationId"
>;

export type UpdateExpenseItemsInput = {
  userId: string;
  category: string;
  items: ExpenseItems[];
};

interface CollectedExpenseRepositoryPort extends Pick<
  BaseRepositoryPort<
    CollectedExpenseData,
    CreateCollectedExpenseData,
    UpdateCollectedExpenseData
  >,
  "create" | "delete" | "find" | "updateOne" | "findById"
> {
  findByUserId(userId: string): Promise<CollectedExpenseData>;
  updateExpenseItems(input: UpdateExpenseItemsInput): Promise<void>;
}

export { CollectedExpenseRepositoryPort };
