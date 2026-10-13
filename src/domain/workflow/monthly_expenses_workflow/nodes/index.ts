import { EndNode, StartNode, Workflow, WorkflowContext } from "myLibrary";
import { PrintDataNode } from "./printNode";
import { ApplicationRepositoryPort } from "../../../repository/application.repository.port";
import { CollectIncomeNode } from "./collect-income.node";
import { EssentialExpenseNode } from "./essential-expense-node";
import { FinancialLoanExpenseNode } from "./financial-loan-expense-node";
import { SubscriptionExpenseNode } from "./subscription-expense-node";
import { InformationReviewNode } from "./information-review.node";
import { CollectedExpenseRepositoryPort } from "../../../repository/collected-expense-data.repository.port";

export type WorkflowDeps = {
  applicationRepository: ApplicationRepositoryPort;
  collectedExpeneRepository: CollectedExpenseRepositoryPort;
};

export type WorkflowIntialContext = {
  context: WorkflowContext;
  currentNodeId: string;
  results: [];
  completed: boolean;
};

export type WorkflowNodes = {
  start: StartNode;
  collectIncome: CollectIncomeNode;
  essentialExpense: EssentialExpenseNode;
  financialLoanExpense: FinancialLoanExpenseNode;
  subscriptionExpense: SubscriptionExpenseNode;
  informationReview: InformationReviewNode;
  end: EndNode;
};

export function createNodes(deps: WorkflowDeps): WorkflowNodes {
  return {
    start: new StartNode(),
    collectIncome: new CollectIncomeNode(),
    essentialExpense: new EssentialExpenseNode(),
    financialLoanExpense: new FinancialLoanExpenseNode(),
    subscriptionExpense: new SubscriptionExpenseNode(),
    informationReview: new InformationReviewNode(
      deps.collectedExpeneRepository,
    ),
    end: new EndNode(),
  };
}

export function registerNodes(workflow: Workflow, nodes: WorkflowNodes): void {
  workflow.addNode(nodes.start);
  workflow.addNode(nodes.collectIncome);
  workflow.addNode(nodes.essentialExpense);
  workflow.addNode(nodes.financialLoanExpense);
  workflow.addNode(nodes.subscriptionExpense);
  workflow.addNode(nodes.informationReview);
  workflow.addNode(nodes.end);
}
