import { BaseRepository, Repository } from "myLibrary";

import collectedExpenseDataSchema, {
  CollectedExpenseDataDocument,
} from "./collected-expense-data.schema";

import { CollectedExpenseData } from "../../../domain/entities/collected-expsense-data";
import {
  CreateCollectedExpenseData,
  UpdateCollectedExpenseData,
  CollectedExpenseRepositoryPort,
} from "../../../domain/repository/collected-expense-data.repository.port";

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
