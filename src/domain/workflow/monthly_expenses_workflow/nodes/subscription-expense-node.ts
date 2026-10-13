import { AsyncNode, injectable, NoInput, NoOutput } from "myLibrary";
import z from "zod";
import { ApplicationScreen } from "../../../entities/application";
import {
  ExpenseItemSchema,
  ExpenseResolveInput,
  ExpenseResolveInputSchema,
  noInputSchema,
} from "./shared-node.type";

const SubscriptionExpenseExecuteOutputSchema = z.object({
  screen: z.literal(ApplicationScreen.SubscriptionExpenseScreen),
});

type SubscriptionExpenseExecuteOutput = z.infer<
  typeof SubscriptionExpenseExecuteOutputSchema
>;

const SubscriptionExpenseResolveOutputSchema = z.object({
  subscriptionItems: z.array(ExpenseItemSchema),
});

export type ExpenseResolveOutput = z.infer<
  typeof SubscriptionExpenseResolveOutputSchema
>;

@injectable()
export class SubscriptionExpenseNode extends AsyncNode<
  NoInput,
  SubscriptionExpenseExecuteOutput,
  ExpenseResolveInput,
  ExpenseResolveOutput
> {
  static readonly NODE_ID = "SubscriptionExpense";
  readonly executeInputSchema = noInputSchema;
  readonly executeOutputSchema = SubscriptionExpenseExecuteOutputSchema;
  readonly resolveInputSchema = ExpenseResolveInputSchema;
  readonly resolveOutputSchema = SubscriptionExpenseResolveOutputSchema;

  constructor() {
    super(SubscriptionExpenseNode.NODE_ID);
  }

  async executionAction(_: NoInput): Promise<SubscriptionExpenseExecuteOutput> {
    return {
      screen: ApplicationScreen.SubscriptionExpenseScreen,
    };
  }

  async resolutionAction(
    input: ExpenseResolveInput,
  ): Promise<ExpenseResolveOutput> {
    return {
      subscriptionItems: input.items.map((item) => ({
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
