import { BaseRepository, Repository } from "myLibrary";

import applicationSchema, { ApplicationDocument } from "./application.schema";
import { Application } from "../../../domain/entities/application";
import {
  CreateApplication,
  UpdateApplication,
  ApplicationRepositoryPort,
} from "../../../domain/repository/application.repository.port";

@Repository("Application", applicationSchema)
class ApplicationRepositoryAdapter
  extends BaseRepository<
    ApplicationDocument,
    Application,
    CreateApplication,
    UpdateApplication
  >
  implements ApplicationRepositoryPort
{
  async findByUserId(userId: string): Promise<Application[]> {
    const applications = await this.model.find({ userId }).exec();

    return applications.map((application) => this.toObject(application));
  }

  protected toObject(document: ApplicationDocument): Application {
    return {
      id: document._id.toHexString(),
      userId: document.userId,
      workflowContext: {
        id: document.workflowContext.id,
        context: document.workflowContext.context,
        currentNodeId: document.workflowContext.currentNodeId,
      },
      screen: document.screen,
      status: document.status,
      submittedAt: document.submittedAt,
    };
  }
}

export { ApplicationRepositoryAdapter };
