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
    isAdmin: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type MessageResponse {
    message: String!
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

  input CreateUserInput {
    fullName: String!
    phoneNumber: String!
    address: String!
    employer: String!
    netWorth: Float!
    email: String!
    password: String!
  }

  input UpdateUserInput {
    fullName: String
    phoneNumber: String
    address: String
    employer: String
    netWorth: Float
    email: String
    password: String
  }

  type Mutation {
    registerUser(input: RegisterInput!): AuthPayload!
    loginUser(input: LoginInput!): AuthPayload!
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): MessageResponse!
  }

  type Query {
    me: User
    allUsers: [User!]!
  }
`;

