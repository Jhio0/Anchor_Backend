import { Workflow, WorkflowEngine } from "myLibrary";
import {
  createNodes,
  registerNodes,
  WorkflowDeps,
  WorkflowIntialContext,
} from "./nodes";
import { registerEdges } from "./edges/edges";

export function buildFirstWorkflow(deps: WorkflowDeps): Workflow {
  const workflow = new Workflow();
  const nodes = createNodes(deps);

  registerNodes(workflow, nodes);
  registerEdges(workflow, nodes);

  return workflow;
}
