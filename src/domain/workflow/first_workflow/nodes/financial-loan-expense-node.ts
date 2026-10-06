import { AsyncNode, injectable, NoInput, NoOutput } from "myLibrary";
import z from "zod";
import { ApplicationScreen } from "../../../entities/application";
import {
  ExpenseItemSchema,
  ExpenseResolveInput,
  ExpenseResolveInputSchema,
  noInputSchema,
} from "./shared-node.type";

const FinancialLoanExpenseExecuteOutputSchema = z.object({
  screen: z.literal(ApplicationScreen.FinancialLoanExpenseScreen),
});

type FinancialLoanExpenseExecuteOutput = z.infer<
  typeof FinancialLoanExpenseExecuteOutputSchema
>;

const FinancialLoanExpenseResolveOutputSchema = z.object({
  financialLoanItems: z.array(ExpenseItemSchema),
});

export type ExpenseResolveOutput = z.infer<
  typeof FinancialLoanExpenseResolveOutputSchema
>;

@injectable()
export class FinancialLoanExpenseNode extends AsyncNode<
  NoInput,
  FinancialLoanExpenseExecuteOutput,
  ExpenseResolveInput,
  ExpenseResolveOutput
> {
  static readonly NODE_ID = "FinancialLoanExpense";
  readonly executeInputSchema = noInputSchema;
  readonly executeOutputSchema = FinancialLoanExpenseExecuteOutputSchema;
  readonly resolveInputSchema = ExpenseResolveInputSchema;
  readonly resolveOutputSchema = FinancialLoanExpenseResolveOutputSchema;

  constructor() {
    super(FinancialLoanExpenseNode.NODE_ID);
  }

  async executionAction(
    _: NoInput,
  ): Promise<FinancialLoanExpenseExecuteOutput> {
    return {
      screen: ApplicationScreen.FinancialLoanExpenseScreen,
    };
  }

  async resolutionAction(
    input: ExpenseResolveInput,
  ): Promise<ExpenseResolveOutput> {
    return {
      financialLoanItems: input.items.map((item) => ({
        name: item.name,
        amount: item.amount,
        source: item.source,
      })),
    };
  }

  async determineOutputPin(context: NoInput) {
    return "outputNavigationPin";
  }
}
