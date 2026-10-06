// ===========================
// Abstract Node
// Base class for all nodes in the workflow
// ===========================

import z from "zod";
import { NoInput, WorkflowContext } from "../types/workflow.types";
import { NodeType, SchemaNodeType } from "../types/node.types";

// Generic node type used across the workflow engine
export type GenericNode = AbstractNode<
  WorkflowContext,
  WorkflowContext,
  WorkflowContext,
  WorkflowContext
>;

export abstract class AbstractNode<
  TExecuteInput extends WorkflowContext,
  TExecuteOuput extends WorkflowContext,
  TResolveInput extends WorkflowContext,
  TResolveOutput extends WorkflowContext,
> {
  id: string; // Unique node ID
  type: NodeType; // Node type (START, END, SYNC, ASYNC)
  protected inputPins: string[] = []; // Node input pins
  protected outputPins: string[] = []; // Node output pins

  // Optional schemas for validation with Zod
  abstract readonly executeInputSchema?: z.ZodType<TExecuteInput>;
  abstract readonly executeOutputSchema?: z.ZodType<TExecuteOuput>;
  abstract readonly resolveInputSchema: z.ZodType<TResolveInput>;
  abstract readonly resolveOutputSchema: z.ZodType<TResolveOutput>;

  constructor(id: string, type: NodeType) {
    this.id = id;
    this.type = type;
  }

  // Executes an async node (if implemented)
  async execute(context: TExecuteInput): Promise<TExecuteOuput> {
    if (!this.executionAction) {
      throw new Error(`Node does not have executionAction: ${NodeType}`);
    }

    // Validate input
    await this.parseSchema(
      this.executeInputSchema,
      context,
      SchemaNodeType.ExecuteInput,
    );

    // Perform node execution
    const result = await this.executionAction(context);

    // Validate output
    await this.parseSchema(
      this.executeOutputSchema,
      result,
      SchemaNodeType.ExecuteOutput,
    );

    return result;
  }

  // Resolves a node (sync or after async execution)
  async resolve(context: TResolveInput): Promise<TResolveOutput> {
    // Validate input
    await this.parseSchema(
      this.resolveInputSchema,
      context,
      SchemaNodeType.ResolveInput,
    );

    // Perform node resolution
    const result = await this.resolutionAction(context);

    // Validate output
    await this.parseSchema(
      this.resolveOutputSchema,
      result,
      SchemaNodeType.ResolveOutput,
    );

    return result;
  }

  // Must be implemented in async nodes
  abstract executionAction?(context: TExecuteInput): Promise<TExecuteOuput>;

  // Must be implemented in all nodes
  abstract resolutionAction(context: TResolveInput): Promise<TResolveOutput>;

  // Validate a schema using Zod
  async parseSchema<T>(
    schema?: z.ZodType<T>,
    context?: unknown,
    schemaNodeType?: SchemaNodeType,
  ): Promise<void> {
    if (!schema) return;

    const result = schema.safeParse(context);

    if (!result.success) {
      throw new Error(
        `Zod Validation Error: ${schemaNodeType} \n${result.error}`,
      );
    }
  }

  // Optional method to determine which output pin to follow
  abstract determineOutputPin?(
    context: TResolveOutput | NoInput,
  ): Promise<string>;
}
