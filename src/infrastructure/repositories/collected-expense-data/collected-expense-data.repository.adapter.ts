import { BaseRepository, Repository } from "myLibrary";

import collectedExpenseDataSchema, {
  CollectedExpenseDataDocument,
} from "./collected-expense-data.schema";

import { CollectedExpenseData } from "../../../domain/entities/collected-expsense-data";
import {
  CreateCollectedExpenseData,
  UpdateCollectedExpenseData,
  CollectedExpenseRepositoryPort,
  UpdateExpenseItemsInput,
  ExpenseSummary,
} from "../../../domain/repository/collected-expense-data.repository.port";
import { ExpenseItem } from "../../../application/api/customer/schema";

@Repository("CollectedExpenseData", collectedExpenseDataSchema)
class CollectedExpenseRepositoryAdapter
  extends BaseRepository<
    CollectedExpenseDataDocument,
    CollectedExpenseData,
    CreateCollectedExpenseData,
    UpdateCollectedExpenseData
  >
  implements CollectedExpenseRepositoryPort
{
  async updateExpenseItems(input: UpdateExpenseItemsInput): Promise<void> {
    const { userId, category, items } = input;

    const doc = await this.model.findOne({ userId });

    if (!doc) {
      throw new Error(`No expense record found for user ${userId}`);
    }

    const allItems: ExpenseItem[] = [
      ...(category === "essentialItems" ? items : (doc.essentialItems ?? [])),
      ...(category === "financialLoanItems"
        ? items
        : (doc.financialItems ?? [])),
      ...(category === "subscriptionItems"
        ? items
        : (doc.subscriptionItems ?? [])),
    ];

    const { totalExpense, moneyLeft, savingsRate } =
      this.calculateExpenseSummary(doc.income, allItems);

    await this.model.updateOne(
      { userId },
      {
        $set: {
          [category]: items,
          totalExpense,
          moneyLeft,
          savingsRate,
        },
      },
    );
  }

  private calculateExpenseSummary(
    incomeAmount: number,
    expenseItems: ExpenseItem[],
  ): ExpenseSummary {
    const totalExpense = expenseItems.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    );

    const moneyLeft = incomeAmount - totalExpense;

    // Guard against divide-by-zero when income is 0
    const savingsRate = incomeAmount > 0 ? (moneyLeft / incomeAmount) * 100 : 0;

    return { totalExpense, moneyLeft, savingsRate };
  }

  async findByUserId(userId: string): Promise<CollectedExpenseData> {
    const document = await this.model.findOne({ userId }).exec();

    if (!document) {
      throw new Error(`Collected expense data not found for user ${userId}`);
    }

    return this.toObject(document);
  }

  protected toObject(
    document: CollectedExpenseDataDocument,
  ): CollectedExpenseData {
    return {
      id: document._id.toHexString(),
      userId: document.userId,
      applicationId: document.applicationId,
      income: document.income,
      totalExpense: document.totalExpense,
      moneyLeft: document.moneyLeft,
      savingsRate: document.savingsRate,
      essentialItems: document.essentialItems.map((item) => ({
        name: item.name,
        amount: item.amount,
        source: item.source,
      })),
      financialItems: document.financialItems.map((item) => ({
        name: item.name,
        amount: item.amount,
        source: item.source,
      })),
      subscriptionItems: document.subscriptionItems.map((item) => ({
        name: item.name,
        amount: item.amount,
        source: item.source,
      })),
    };
  }
}

export { CollectedExpenseRepositoryAdapter };
