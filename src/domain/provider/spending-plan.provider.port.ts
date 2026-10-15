import { SpendingPlan } from "../entities/spending-plan";

export type CreateSpendingPlanInput = {
  userId: string;
  collectedExpenseId: string;
  monthLabel: Date;
  totalBudget: number;
};

export interface SpendingPlanProviderPort {
  createSpendingPlan(input: CreateSpendingPlanInput): Promise<SpendingPlan>;
}
