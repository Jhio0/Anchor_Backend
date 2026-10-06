// ===========================
// Workflow
// Manages nodes and edges in a workflow
// ===========================

import { GenericNode } from "../nodes/abstract.node";
import { Edge } from "../types/workflow.types";

export class Workflow {
  nodes: Map<string, GenericNode> = new Map(); // store nodes by ID
  edges: Edge[] = []; // store connections between nodes

  // Add a node to the workflow
  addNode(node: GenericNode): void {
    this.nodes.set(node.id, node);
  }

  // Add an edge/connection between nodes
  addEdge(edge: Edge): void {
    this.edges.push(edge);
  }

  // Find an edge originating from a specific node and pin
  findEdgeFromPin(nodeId: string, pinId: string): Edge {
    const pin = this.edges.find(
      (e) => e.sourceNodeId === nodeId && e.sourcePinId === pinId,
    );

    if (!pin) {
      throw new Error("edge.targetNodeId does not exist in the edge");
    }

    return pin;
  }

  // Get a node by ID, throws error if not found
  getNode(nodeId: string): GenericNode {
    const node = this.nodes.get(nodeId);

    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    return node;
  }
}
