import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    id: ID!
    fullName: String!
    phoneNumber: String!
    address: String!
    employer: String!
    netWorth: Float!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    fullName: String!
    phoneNumber: String!
    address: String!
    employer: String!
    netWorth: Float!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Mutation {
    registerUser(input: RegisterInput!): AuthPayload!
    loginUser(input: LoginInput!): AuthPayload!
  }

  type Query {
    me: User
  }
`;
