// ===========================
// Workflow Types
// ===========================

// Generic workflow context: can store any data from nodes
export type WorkflowContext = Record<string, any>;

// Represents no input for nodes
export type NoInput = Record<string, never>;

// Represents no output for nodes
export type NoOutput = Record<string, never>;

// Represents a connection/edge between nodes
export interface Edge {
  sourceNodeId: string; // ID of the node where edge originates
  sourcePinId: string; // Pin on the source node
  targetNodeId: string; // ID of the node where edge points to
  targetPinId: string; // Pin on the target node
}

// Type of result a node can produce
export enum NodeResultType {
  ExecutionResult = "ExecutionResult", // From async node execution
  ResolvedResult = "ResolvedResult", // From resolution (sync or async)
}

// Stores a single node's result in workflow execution
export interface WorkflowNodeResult {
  nodeId: string; // ID of the node
  result: WorkflowContext; // Node output context
  type: NodeResultType; // Type of result
  outputPinId?: string; // Optional output pin used to traverse edges
}

// Represents the overall workflow state at any moment
export interface WorkflowState {
  currentNodeId: string; // Node currently executing
  context: WorkflowContext; // Accumulated workflow context
  results: WorkflowNodeResult[]; // All node results so far
  completed: boolean; // Whether workflow has finished
}
