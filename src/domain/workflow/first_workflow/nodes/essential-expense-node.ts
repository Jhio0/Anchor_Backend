import { AsyncNode, injectable, NoInput, NoOutput } from "myLibrary";
import z from "zod";
import { ApplicationScreen } from "../../../entities/application";
import {
  ExpenseItemSchema,
  ExpenseResolveInput,
  ExpenseResolveInputSchema,
  noInputSchema,
} from "./shared-node.type";

const EssentialExpenseExecuteOutputSchema = z.object({
  screen: z.literal(ApplicationScreen.EssentialExpenseScreen),
});
type EssentialExpenseExecuteOutput = z.infer<
  typeof EssentialExpenseExecuteOutputSchema
>;

const EssentialExpenseResolveOutputSchema = z.object({
  essentialItems: z.array(ExpenseItemSchema),
});

export type ExpenseResolveOutput = z.infer<
  typeof EssentialExpenseResolveOutputSchema
>;

@injectable()
export class EssentialExpenseNode extends AsyncNode<
  NoInput,
  EssentialExpenseExecuteOutput,
  ExpenseResolveInput,
  ExpenseResolveOutput
> {
  static readonly NODE_ID = "EssentialExpense";
  readonly executeInputSchema = noInputSchema;
  readonly executeOutputSchema = EssentialExpenseExecuteOutputSchema;
  readonly resolveInputSchema = ExpenseResolveInputSchema;
  readonly resolveOutputSchema = EssentialExpenseResolveOutputSchema;

  constructor() {
    super(EssentialExpenseNode.NODE_ID);
  }

  async executionAction(_: NoInput): Promise<EssentialExpenseExecuteOutput> {
    return {
      screen: ApplicationScreen.EssentialExpenseScreen,
    };
  }

  async resolutionAction(
    input: ExpenseResolveInput,
  ): Promise<ExpenseResolveOutput> {
    return {
      essentialItems: input.items.map((item) => ({
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
