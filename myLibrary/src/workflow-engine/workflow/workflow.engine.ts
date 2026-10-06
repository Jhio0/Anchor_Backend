// ===========================
// Workflow Engine
// Handles execution of a Workflow with SYNC, ASYNC, and END nodes
// ===========================

import { GenericNode } from "../nodes/abstract.node";
import { NodeType } from "../types/node.types";
import {
  NodeResultType,
  WorkflowContext,
  WorkflowState,
} from "../types/workflow.types";
import { Workflow } from "./workflow";

// Bundles the workflow + its in-flight state, since almost every
// private helper below needs both together.
interface ExecutionContext {
  workflow: Workflow;
  state: WorkflowState;
}

// The (nodeId, context, type) triple that used to be passed around
// as three separate params every time we recorded a node's result.
interface NodeResolution {
  nodeId: string;
  context: WorkflowContext;
  type: NodeResultType;
}

//plan to make this into a single ton instead
export class WorkflowEngine {
  private workflows = new Map<string, Workflow>();

  registerWorkflow(workflowId: string, workflow: Workflow): void {
    this.workflows.set(workflowId, workflow);
  }

  getWorkflow(workflowId: string): Workflow {
    const workflow = this.workflows.get(workflowId);

    if (!workflow) {
      throw new Error("No Workflow exist for that WorkflowId");
    }

    return workflow;
  }

  // Main engine loop: runs nodes until workflow completes or hits an ASYNC node
  async run(workflowId: string, state: WorkflowState): Promise<WorkflowState> {
    const ctx: ExecutionContext = {
      workflow: this.getWorkflow(workflowId),
      state,
    };

    while (ctx.state.currentNodeId && !ctx.state.completed) {
      const currentNode: GenericNode = ctx.workflow.getNode(
        ctx.state.currentNodeId,
      );

      switch (currentNode.type) {
        case NodeType.SYNC: {
          // Resolve SYNC node immediately and continue to next node
          await this.runSyncNode(ctx, currentNode);
          break;
        }

        case NodeType.ASYNC: {
          // Execute ASYNC node and pause engine until data is stored
          await this.runAsyncNode(ctx, currentNode);
          return ctx.state; // pause engine
        }

        case NodeType.END: {
          // Mark workflow as completed
          await this.applyNodeResult(ctx.state, {
            nodeId: currentNode.id,
            context: { currentNode: currentNode.id },
            type: NodeResultType.ResolvedResult,
          });

          ctx.state.completed = true;
          return ctx.state; // stop engine
        }

        default:
          throw new Error(`Unknown node type: ${currentNode.type}`);
      }

      // Move to next node based on current node's output pin
      ctx.state.currentNodeId = await this.determineNextNode(ctx, currentNode);
    }

    return ctx.state; // workflow fully processed
  }

  // Apply the result of a node execution or resolution to the workflow state
  private async applyNodeResult(
    state: WorkflowState,
    resolution: NodeResolution,
  ): Promise<void> {
    const currentNode = state.currentNodeId;

    // Merge new context into the current state
    // 🔥 ALWAYS merge currentNodeId into context
    const mergedContext = this.computeLatestContext([
      state.context,
      resolution.context,
      { currentNode }, // ✅ enforce here
    ]);

    state.context = mergedContext;

    state.results.push({
      nodeId: resolution.nodeId,
      result: mergedContext,
      type: resolution.type,
    });
  }

  // Run a synchronous node: resolve immediately and apply its result
  private async runSyncNode(
    ctx: ExecutionContext,
    node: GenericNode,
  ): Promise<void> {
    const context: WorkflowContext = await node.resolve(ctx.state.context);
    await this.applyNodeResult(ctx.state, {
      nodeId: node.id,
      context,
      type: NodeResultType.ResolvedResult,
    });
  }

  // Run an asynchronous node: execute and store the result, engine will pause
  private async runAsyncNode(
    ctx: ExecutionContext,
    node: GenericNode,
  ): Promise<void> {
    if (!node.execute) {
      throw new Error(`Async node ${node.id} does not implement execute`);
    }

    const result: WorkflowContext = await node.execute(ctx.state.context);
    ctx.state.currentNodeId = node.id; // keep current node active

    await this.applyNodeResult(ctx.state, {
      nodeId: node.id,
      context: result,
      type: NodeResultType.ExecutionResult,
    });
  }

  // Store data from an ASYNC node and resume workflow execution
  async storeCollectedData(
    workflowId: string,
    state: WorkflowState,
    payload: WorkflowContext,
  ): Promise<WorkflowState> {
    const ctx: ExecutionContext = {
      workflow: this.getWorkflow(workflowId),
      state,
    };
    const nodeId: string = state.currentNodeId!;
    const node: GenericNode = ctx.workflow.getNode(nodeId);

    if (node.type !== NodeType.ASYNC) {
      throw new Error(`storeCollectedData can only be used for async nodes`);
    }

    // Resolve node with provided payload
    const context = await node.resolve({
      ...ctx.state.context,
      ...payload,
    });

    await this.applyNodeResult(ctx.state, {
      nodeId: node.id,
      context,
      type: NodeResultType.ResolvedResult,
    });

    // Move to next node and continue running
    ctx.state.currentNodeId = await this.determineNextNode(ctx, node);
    return this.run(workflowId, ctx.state);
  }

  // Determine the next node in the workflow based on output pin and edges
  private async determineNextNode(
    ctx: ExecutionContext,
    node: GenericNode,
  ): Promise<string> {
    if (!node.determineOutputPin) {
      throw new Error("no outputs -> workflow path ends");
    }

    const outputPin: string = await node.determineOutputPin(ctx.state.context);
    const edge = ctx.workflow.findEdgeFromPin(node.id, outputPin);

    return edge?.targetNodeId;
  }

  // Merge multiple contexts into a single workflow context
  private computeLatestContext(contexts: WorkflowContext[]): WorkflowContext {
    return contexts.reduce((acc, curr) => ({ ...acc, ...curr }), {});
  }
}
