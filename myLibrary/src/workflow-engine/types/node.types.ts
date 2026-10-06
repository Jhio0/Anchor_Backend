// ===========================
// Node Types
// ===========================

// Represents the type of node in the workflow
export enum NodeType {
  START = "START", // Entry node of workflow
  END = "END", // Exit node of workflow
  SYNC = "SYNC", // Synchronous node, resolves immediately
  ASYNC = "ASYNC", // Asynchronous node, execution may pause workflow
}

// Represents which schema is being validated in a node
export enum SchemaNodeType {
  ExecuteInput = "ExecuteInput", // Input schema for execute() of async node
  ExecuteOutput = "ExecuteOutput", // Output schema from execute() of async node
  ResolveInput = "ResolveInput", // Input schema for resolve() of sync/async node
  ResolveOutput = "ResolveOutput", // Output schema from resolve() of sync/async node
}
