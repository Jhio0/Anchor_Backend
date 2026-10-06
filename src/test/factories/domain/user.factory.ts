import { faker } from "@faker-js/faker";
import { User } from "../../../domain/entities/user";

export const fakeUser = (overrides = {}): User => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  dateOfBirth: faker.date.birthdate({ min: 18, max: 80 }),
  password: faker.internet.password({ length: 12 }),
  ...overrides,
});
