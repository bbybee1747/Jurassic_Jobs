import { gql } from 'apollo-server-express';

export const dinosaurTypeDefs = gql`
  type Dinosaur {
    id: ID!
    age: Int!
    species: String!
    size: String!
    price: Float!
    imageUrl: String
    description: String
  }

  extend type Query {
    dinosaurs(sortBy: String): [Dinosaur!]!
    searchDinosaur(query: String!): [Dinosaur!]!
  }

  input DinosaurInput {
    age: Int!
    species: String!
    size: String!
    price: Float!
    imageUrl: String
    description: String
  }

  input UpdateDinosaurInput {
    age: Int
    species: String
    size: String
    price: Float
    imageUrl: String
    description: String
  }

  extend type Mutation {
    addDinosaur(input: DinosaurInput!): Dinosaur!
    updateDinosaur(id: ID!, input: UpdateDinosaurInput!): Dinosaur!
    deleteDinosaur(id: ID!): String!
  }
`;
