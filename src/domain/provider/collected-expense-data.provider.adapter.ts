import { Provider } from "myLibrary";
import { RepositoryTokens } from "../../lib/injection-tokens/repository-tokens";
import { inject } from "../../lib/strict-inject";
import {
  CollectedExpenseItems,
  ExpenseItems,
  ExpenseSource,
} from "../entities/collected-expsense-data";
import { CollectedExpenseRepositoryPort } from "../repository/collected-expense-data.repository.port";
import {
  CollectedExpenseDataProviderPort,
  UpdateCollectedExpenseItemsInput,
} from "./collected-expense-data.provider.port";

@Provider
export class CollectedExpenseDataProviderAdapter implements CollectedExpenseDataProviderPort {
  constructor(
    @inject(RepositoryTokens.CollectedExpenseDataRepository)
    private collectedExpenseDataRepositoryPort: CollectedExpenseRepositoryPort,
  ) {}

  private readonly expenseItem: Record<
    ExpenseSource,
    keyof CollectedExpenseItems
  > = {
    [ExpenseSource.ESSENTIALS]: "essentialItems",
    [ExpenseSource.FINANCIAL_LOAN]: "financialItems",
    [ExpenseSource.SUBSCRIPTION]: "subscriptionItems",
  };

  async updateCollectedExpenseItems(
    input: UpdateCollectedExpenseItemsInput,
  ): Promise<boolean> {
    const { userId, category, items } = input;

    await this.collectedExpenseDataRepositoryPort.updateExpenseItems({
      userId,
      category: this.expenseItem[category],
      items: items.map((item) => ({
        ...item,
        source: category,
      })),
    });
    return true;
  }
}
