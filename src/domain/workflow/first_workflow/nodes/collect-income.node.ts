import { AsyncNode, injectable, NoInput, NoOutput } from "myLibrary";
import z from "zod";
import { ApplicationScreen } from "../../../entities/application";
import { noInputSchema } from "./shared-node.type";

const collectIncomeExecuteOutputSchema = z.object({
  screen: z.literal(ApplicationScreen.IncomeDetailScreen),
});
const collectIncomeResolveSchema = z.object({
  incomeAmount: z.number(),
});

type CollectIncomeExecuteOuput = z.infer<
  typeof collectIncomeExecuteOutputSchema
>;

export type CollectIncomeResolveInput = z.infer<
  typeof collectIncomeResolveSchema
>;

export type CollectIncomeResolveOutput = z.infer<
  typeof collectIncomeResolveSchema
>;

@injectable()
export class CollectIncomeNode extends AsyncNode<
  NoInput,
  CollectIncomeExecuteOuput,
  CollectIncomeResolveInput,
  CollectIncomeResolveOutput
> {
  static readonly NODE_ID = "CollectIncome";
  readonly executeInputSchema = noInputSchema;
  readonly executeOutputSchema = collectIncomeExecuteOutputSchema;
  readonly resolveInputSchema = collectIncomeResolveSchema;
  readonly resolveOutputSchema = collectIncomeResolveSchema;

  constructor() {
    super(CollectIncomeNode.NODE_ID);
  }

  async executionAction(_: NoInput): Promise<CollectIncomeExecuteOuput> {
    return {
      screen: ApplicationScreen.IncomeDetailScreen,
    };
  }

  async resolutionAction(
    input: CollectIncomeResolveInput,
  ): Promise<CollectIncomeResolveOutput> {
    return {
      incomeAmount: input.incomeAmount,
    };
  }

  async determineOutputPin(context: NoInput) {
    return "outputNavigationPin";
  }
}
