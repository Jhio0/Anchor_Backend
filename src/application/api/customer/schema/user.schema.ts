import { gql } from "apollo-server";

export const userSchema = gql`
  type User {
    id: ID!
    name: String!
    dateOfBirth: String!
    email: String!
  }

  type Query {
    # me: returns the currently logged-in user based on their token.
    # Returns null if not authenticated.
    me: User
    # Log in with existing credentials
    login(email: String!, password: String!): AuthPayload!
    user(id: ID!): User!
  }

  type Mutation {
    createUser(name: String!, dateOfBirth: String!, email: String!): User!

    # Register a new account
    signup(
      name: String!
      email: String!
      password: String!
      dateOfBirth: String!
    ): AuthPayload!
  }
`;
