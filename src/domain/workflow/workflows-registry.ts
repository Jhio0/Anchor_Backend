import {
  injectable,
  StartNode,
  Workflow,
  WorkflowEngine,
  WorkflowState,
} from "myLibrary";

import { ApplicationRepositoryPort } from "../repository/application.repository.port";
import { inject } from "../../lib/strict-inject";
import { RepositoryTokens } from "../../lib/injection-tokens/repository-tokens";
import { buildFirstWorkflow } from "./first_workflow/engine";
import z from "zod";
import { CollectedExpenseRepositoryPort } from "../repository/collected-expense-data.repository.port";

const initialContextSchema = z.object({
  userId: z.string(),
});

export type InitialContext = z.infer<typeof initialContextSchema>;

@injectable()
export class WorkflowRegistry {
  public readonly engine: WorkflowEngine;
  private readonly workflows = new Map<string, Workflow>();

  constructor(
    @inject(RepositoryTokens.ApplicationRepository)
    private applicationRepositoryPort: ApplicationRepositoryPort,
    @inject(RepositoryTokens.CollectedExpenseDataRepository)
    private collectedExpenseRepositoryPort: CollectedExpenseRepositoryPort,
  ) {
    this.engine = new WorkflowEngine();

    this.register(
      "first_workflow",
      buildFirstWorkflow({
        applicationRepository: this.applicationRepositoryPort,
        collectedExpeneRepository: this.collectedExpenseRepositoryPort,
      }),
    );

    // future workflows just get added here, nowhere else:
    // this.register("appeal_workflow", buildAppealWorkflow({ ... }));
  }

  private register(workflowId: string, workflow: Workflow): void {
    this.engine.registerWorkflow(workflowId, workflow);
    this.workflows.set(workflowId, workflow);
  }

  private getWorkflow(workflowId: string): Workflow {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error(`Unknown workflow: ${workflowId}`);
    return workflow;
  }

  // Builds a fresh, valid initial state for starting a brand-new applicationwo

  // need to refactor this overall beacuse eac applicaiton in future mught have a different context overall and what we can do is based on the workflowId we can dteremine waht context it need's to build overall
  createInitialState(context: InitialContext): WorkflowState {
    const parsedContext = initialContextSchema.parse(context);

    return {
      context: parsedContext,
      currentNodeId: StartNode.NODE_ID,
      results: [],
      completed: false,
    };
  }
}
