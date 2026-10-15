import {
  ExpenseItems,
  ExpenseSource,
} from "../entities/collected-expsense-data";

export type UpdateCollectedExpenseItemsInput = {
  userId: string;
  category: ExpenseSource;
  items: Omit<ExpenseItems, "source">[];
};

export type UpdateSpendingPlanSummaryInput = {
  collectedExpenseId: string;
  totalBudget: number;
};

export interface CollectedExpenseDataProviderPort {
  updateCollectedExpenseItems(
    input: UpdateCollectedExpenseItemsInput,
  ): Promise<boolean>;

  updateExpenseSummary(input: UpdateSpendingPlanSummaryInput): Promise<void>;
}
