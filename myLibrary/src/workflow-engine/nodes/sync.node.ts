// ===========================
// Sync Node
// Represents nodes that run immediately (no async/pause)
// ===========================

import z from "zod";
import { NodeType } from "../types/node.types";
import { NoInput, NoOutput, WorkflowContext } from "../types/workflow.types";
import { AbstractNode } from "./abstract.node";

export abstract class SyncNode<
  TResolveInput extends WorkflowContext,
  TResolveOutput extends WorkflowContext,
> extends AbstractNode<NoInput, NoOutput, TResolveInput, TResolveOutput> {
  // Sync nodes do not have an execution phase
  readonly executeInputSchema = z.never();
  readonly executeOutputSchema = z.never();

  executionAction = undefined; // no async execution

  constructor(id: string) {
    // Set node type to SYNC automatically
    super(id, NodeType.SYNC);

    // Default input/output pins for workflow navigation
    this.inputPins = ["inputNavigationPin"];
    this.outputPins = ["outputNavigationPin"];
  }
}
