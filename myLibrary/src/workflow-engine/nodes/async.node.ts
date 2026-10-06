// ===========================
// Async Node
// Represents nodes that require external/paused execution
// ===========================

import z from "zod";
import { NodeType } from "../types/node.types";
import { WorkflowContext } from "../types/workflow.types";
import { AbstractNode } from "./abstract.node";

export abstract class AsyncNode<
  TExecuteInput extends WorkflowContext,
  TExecuteOuput extends WorkflowContext,
  TResolveInput extends WorkflowContext,
  TResolveOutput extends WorkflowContext,
> extends AbstractNode<
  TExecuteInput,
  TExecuteOuput,
  TResolveInput,
  TResolveOutput
> {
  constructor(id: string) {
    // Set node type to ASYNC automatically
    super(id, NodeType.ASYNC);

    // Default input pin (where flow enters this node)
    this.inputPins = ["inputNavigationPin"];

    // Default output pin (where flow exits after resolve)
    this.outputPins = ["outputNavigationPin"];
  }
}
