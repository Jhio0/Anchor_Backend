import {
  ExpenseItems,
  ExpenseSource,
} from "../entities/collected-expsense-data";

export type UpdateCollectedExpenseItemsInput = {
  userId: string;
  category: ExpenseSource;
  items: Omit<ExpenseItems, "source">[];
};

export interface CollectedExpenseDataProviderPort {
  updateCollectedExpenseItems(
    input: UpdateCollectedExpenseItemsInput,
  ): Promise<boolean>;
}
