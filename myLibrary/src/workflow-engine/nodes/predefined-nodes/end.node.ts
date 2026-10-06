// ===========================
// End Node
// Represents the final node in a workflow
// ===========================

import z from "zod";
import { NoInput, NoOutput } from "../../types/workflow.types";
import { SyncNode } from "../sync.node";
import { NodeType } from "../../types/node.types";

const endResolveOutputSchema = z.object({
  screen: z.string(),
});

type EndNodeResolveOutput = z.infer<typeof endResolveOutputSchema>;

export class EndNode extends SyncNode<NoInput, EndNodeResolveOutput> {
  static readonly NODE_ID = "end";
  // No input or output data needed
  readonly resolveInputSchema = z.object({});
  readonly resolveOutputSchema = endResolveOutputSchema;

  constructor() {
    super(EndNode.NODE_ID);

    // Mark node as END type
    this.type = NodeType.END;

    // End node has no outputs
    this.outputPins = [];
  }

  // No execution phase for sync nodes
  executionAction = undefined;

  // Resolving just returns empty object
  async resolutionAction(_: NoInput): Promise<EndNodeResolveOutput> {
    return {
      screen: "CompletedScreen",
    };
  }

  // End node does not have any output pins
  async determineOutputPin(): Promise<string> {
    throw new Error("End node has no output pins");
  }
}
