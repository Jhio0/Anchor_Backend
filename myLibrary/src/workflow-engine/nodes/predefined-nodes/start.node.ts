// ===========================
// Start Node
// Represents the entry point of a workflow
// ===========================

import z from "zod";
import { NoInput, NoOutput } from "../../types/workflow.types";
import { SyncNode } from "../sync.node";

export class StartNode extends SyncNode<NoInput, NoOutput> {
  static readonly NODE_ID = "start";
  // Start node can accept/return any input/output
  readonly resolveInputSchema = z.any();
  readonly resolveOutputSchema = z.any();

  constructor() {
    super(StartNode.NODE_ID);
    // Type and pins are inherited from SyncNode
  }

  // Resolving start node simply passes through the context
  async resolutionAction(context: NoInput): Promise<NoOutput> {
    return context;
  }

  // Always returns the default output pin
  async determineOutputPin(): Promise<string> {
    return "outputNavigationPin";
  }
}
