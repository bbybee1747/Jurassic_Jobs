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

  type Query {
    dinosaurs(sortBy: String): [Dinosaur!]!
  }
`;
