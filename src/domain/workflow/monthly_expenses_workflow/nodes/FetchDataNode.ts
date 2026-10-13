import { AsyncNode, NoInput } from "myLibrary";
import z from "zod";

// 1️⃣ Define an Async Node
const fetchDataSchema = z.object({ data: z.string() });
const noInputSchema = z.object({});

type FetchData = z.infer<typeof fetchDataSchema>;

// Async Node
export class FetchDataNode extends AsyncNode<
  Record<string, never>,
  FetchData,
  FetchData,
  FetchData
> {
  readonly executeInputSchema = noInputSchema;
  readonly executeOutputSchema = fetchDataSchema;
  readonly resolveInputSchema = fetchDataSchema;
  readonly resolveOutputSchema = fetchDataSchema;

  constructor(id: string = "fetch") {
    super(id);
  }

  async executionAction(context: NoInput) {
    console.log("Executing async node...");
    return { data: "hello world" };
  }

  async resolutionAction(context: { data: string }) {
    console.log("Resolving async node...");
    return context;
  }

  async determineOutputPin(context: { data: string }) {
    return "outputNavigationPin";
  }
}
