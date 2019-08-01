import { gql } from "apollo-server";

export const typeDefs = gql`
  scalar Date

  type PageInfo {
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
  }

  input MovementWhere {
    type: MovementType
    from: Date
    to: Date
  }

  input MovementInsertInput {
    amount: Float!
    description: String
    type: MovementType!
    date: Date
  }

  input MovementUpdateInput {
    id: String!
    amount: Float
    description: String
    type: MovementType
    date: Date
  }

  type Movement {
    id: String!
    amount: Float!
    description: String
    type: MovementType!
    date: Date!
    userId: String!
  }

  type MovementList {
    content: [Movement]
    pageInfo: PageInfo!
    count: Int!
  }

  type DeletedMovement {
    id: String!
  }

  enum MovementType {
    FOOD
    PUBLIC_TRANSPORT
    FUEL
    FUN
    MUTUO
    SPESE_CONDOMINIALI
    STIPENDIO
    OTHER
  }

  type Balance {
    id: String!
    owner: String!
    amount: Float!
  }

  type Query {
    movements(offset: Int, limit: Int, where: MovementWhere): MovementList!
    movement(id: String!): Movement
    balance(atDate: Date): Balance
  }

  type Mutation {
    createMovement(input: MovementInsertInput): Movement
    updateMovement(input: MovementUpdateInput): Movement
    deleteMovement(id: String!): DeletedMovement
    initBalance(amount: Float!): Balance
  }
`;
