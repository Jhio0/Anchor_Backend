import { z } from "zod";
import {
  ExpenseItemSchema,
  ExpenseResolveInput,
  noInputSchema,
} from "./shared-node.type";
import { AsyncNode, NoInput, NoOutput } from "myLibrary";
import { inject, injectable } from "tsyringe";
import { ApplicationScreen } from "../../../entities/application";
import { ExpenseItem } from "../../../../application/api/customer/schema";
import { RepositoryTokens } from "../../../../lib/injection-tokens/repository-tokens";
import { CollectedExpenseRepositoryPort } from "../../../repository/collected-expense-data.repository.port";

export const InformationReviewResolveInputSchema = z.object({
  userId: z.string(),
  applicationId: z.string(),
  incomeAmount: z.number(),
  essentialItems: z.array(ExpenseItemSchema),
  financialLoanItems: z.array(ExpenseItemSchema),
  subscriptionItems: z.array(ExpenseItemSchema),
});

export const InformationReviewResolveOutputSchema = z.object({});

export const InformationReviewExecuteInputSchema = z.object({
  incomeAmount: z.number(),
  essentialItems: z.array(ExpenseItemSchema),
  financialLoanItems: z.array(ExpenseItemSchema),
  subscriptionItems: z.array(ExpenseItemSchema),
});

export const InformationReviewExecuteOutputSchema = z.object({
  incomeAmount: z.number().optional(),
  screen: z.literal("InformationReviewScreen"),
  essentialItems: z.array(ExpenseItemSchema),
  financialLoanItems: z.array(ExpenseItemSchema),
  subscriptionItems: z.array(ExpenseItemSchema),
});

export type InformationReviewResolveInput = z.infer<
  typeof InformationReviewResolveInputSchema
>;

export type InformationReviewResolveOutput = z.infer<
  typeof InformationReviewResolveOutputSchema
>;

export type InformationReviewExecuteInput = z.infer<
  typeof InformationReviewExecuteInputSchema
>;
export type InformationReviewExecuteOutput = z.infer<
  typeof InformationReviewExecuteOutputSchema
>;

@injectable()
export class InformationReviewNode extends AsyncNode<
  InformationReviewExecuteInput,
  InformationReviewExecuteOutput,
  InformationReviewResolveInput,
  InformationReviewResolveOutput
> {
  static readonly NODE_ID = "InformationReview";
  readonly executeInputSchema = InformationReviewExecuteInputSchema;
  readonly executeOutputSchema = InformationReviewExecuteOutputSchema;
  readonly resolveInputSchema = InformationReviewResolveInputSchema;
  readonly resolveOutputSchema = InformationReviewResolveOutputSchema;

  constructor(
    @inject(RepositoryTokens.CollectedExpenseDataRepository)
    private collectedExpenseRepositoryPort: CollectedExpenseRepositoryPort,
  ) {
    super(InformationReviewNode.NODE_ID);
  }

  async executionAction(
    input: InformationReviewExecuteInput,
  ): Promise<InformationReviewExecuteOutput> {
    return {
      incomeAmount: input.incomeAmount,
      screen: ApplicationScreen.InformationReviewScreen,
      essentialItems: input.essentialItems,
      financialLoanItems: input.financialLoanItems,
      subscriptionItems: input.subscriptionItems,
    };
  }

  async resolutionAction(
    input: InformationReviewResolveInput,
  ): Promise<InformationReviewResolveOutput> {
    const expenseItems = [
      input.essentialItems,
      input.financialLoanItems,
      input.subscriptionItems,
    ].flat();

    const totalExpense = this.calculateTotalExpenseItems(expenseItems);

    const moneyLeft = input.incomeAmount - totalExpense;

    const savingsRate = (moneyLeft / input.incomeAmount) * 100;

    await this.collectedExpenseRepositoryPort.create({
      userId: input.userId,
      applicationId: input.applicationId,
      income: input.incomeAmount,
      totalExpense,
      moneyLeft,
      savingsRate,
      essentialItems: input.essentialItems,
      subscriptionItems: input.subscriptionItems,
      financialItems: input.financialLoanItems,
    });

    return {};
  }

  private calculateTotalExpenseItems(expenseItems: ExpenseItem[]): number {
    return expenseItems.reduce((total, item) => total + item.amount, 0);
  }

  async determineOutputPin(context: NoInput) {
    return "outputNavigationPin";
  }
}
