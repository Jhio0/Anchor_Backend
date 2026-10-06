import gql from "graphql-tag";

export const authSchema = gql`
  # AuthPayload is what signup and login return.
  # user: basic info about who just logged in
  type AuthPayload {
    sessionId: String!
    user: User!
  }
`;
