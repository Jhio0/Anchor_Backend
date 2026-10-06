import { WorkflowContext } from "myLibrary";
import { ApplicationPayload, ApplicationScreen } from "../entities/application";

export type CreateApplicationResponse = {
  applicationId: string;
  screen: ApplicationScreen;
};

interface ApplicationProviderPort {
  createApplication(userId: string): Promise<CreateApplicationResponse>;
  submitScreen<T extends WorkflowContext>(
    applicationId: string,
    data: T,
  ): Promise<ApplicationPayload>;
}

export default ApplicationProviderPort;
