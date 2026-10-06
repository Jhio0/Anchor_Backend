import {
  ApplicationPayload,
  ApplicationScreen,
} from "../../entities/application";

export type handleIncomeNodeHandlerInput = {
  applicationId: string;
  incomeAmount: number;
};

interface SubmitIncomeNodeHandlerProviderPort {
  handleIncomeNodeHandler(
    input: handleIncomeNodeHandlerInput,
  ): Promise<ApplicationPayload>;
}

export default SubmitIncomeNodeHandlerProviderPort;
