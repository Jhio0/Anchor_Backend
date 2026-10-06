import { faker } from "@faker-js/faker";
import {
  Application,
  ApplicationStatus,
} from "../../../domain/entities/application";

export const fakeApplication = (overrides = {}): Application => ({
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  workflowContext: {
    id: faker.string.uuid(),
    context: { step: faker.number.int({ min: 1, max: 5 }) },
    currentNodeId: faker.string.uuid(),
  },
  screen: faker.lorem.word(),
  status: faker.helpers.enumValue(ApplicationStatus),
  submittedAt: faker.date.recent(),
  ...overrides,
});
