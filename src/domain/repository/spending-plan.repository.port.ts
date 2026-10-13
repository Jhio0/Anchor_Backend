import { BaseRepositoryPort } from "myLibrary";
import { SpendingPlan } from "../entities/spending-plan";

export type CreateSpendingPlan = Omit<SpendingPlan, "id">;
export type UpdateSpendingPlan = Omit<
  SpendingPlan,
  "id" | "userId" | "applicationId"
>;

export interface SpendingPlanRepositoryPort extends Pick<
  BaseRepositoryPort<SpendingPlan, CreateSpendingPlan, UpdateSpendingPlan>,
  "create" | "delete" | "find" | "updateOne" | "findById"
> {
  findByUserAndMonth(
    userId: string,
    monthLabel: Date,
  ): Promise<SpendingPlan | null>;
}
