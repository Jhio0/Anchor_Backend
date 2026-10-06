import { faker } from "@faker-js/faker";

export const fakeAuthCredentials = (overrides = {}) => ({
  email: faker.internet.email(),
  password: faker.internet.password({ length: 12 }),
  ...overrides,
});

export const fakeSignupInput = (overrides = {}) => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password({ length: 12 }),
  dateOfBirth: faker.date
    .birthdate({ min: 18, max: 80 })
    .toISOString()
    .split("T")[0],
  ...overrides,
});

export const fakeAuthPayload = (overrides = {}) => ({
  token: faker.string.alphanumeric(32),
  user: {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    dateOfBirth: faker.date
      .birthdate({ min: 18, max: 80 })
      .toISOString()
      .split("T")[0],
  },
  ...overrides,
});
