import { SyncNode } from "myLibrary";
import z from "zod";

// 2️⃣ Define a Sync Node that runs after Async
const printDataSchema = z.object({ data: z.string() });
const printDataOutSchema = z.object({ printed: z.boolean() });

type printData = z.infer<typeof printDataSchema>;
type printOutData = z.infer<typeof printDataOutSchema>;

export class PrintDataNode extends SyncNode<printData, printOutData> {
  readonly resolveInputSchema = printDataSchema;
  readonly resolveOutputSchema = printDataOutSchema;

  constructor(id: string = "print") {
    super(id);
  }

  async resolutionAction(context: { data: string }) {
    console.log("Printing data:", context.data);
    return { printed: true };
  }

  async determineOutputPin() {
    return "outputNavigationPin";
  }
}
