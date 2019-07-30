import { ApolloServer, gql } from "apollo-server";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

import { getCollectionsGateway } from "./service/CollectionsGateway";
import { MovementService, MovementServiceT } from "./service/MovementService";
import { ListMovementsWhere } from "./types/MovementWhere";
import { Movement } from "./types/Movement";

const typeDefs = gql`
  scalar Date

  type PageInfo {
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
  }

  input MovementWhere {
    type: MovementType
    from: Int
    to: Int
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

  type Query {
    movements(offset: Int, limit: Int, where: MovementWhere): MovementList
    movement(id: String!): Movement
  }

  type Mutation {
    createMovement(input: MovementInsertInput): Movement
    updateMovement(input: MovementUpdateInput): Movement
    deleteMovement(id: String!): DeletedMovement
  }
`;

type Context = { movementService: MovementServiceT };

const resolvers = {
  Query: {
    movements: (
      parent,
      args: { offset: number | null; limit: number | null; where: ListMovementsWhere | null },
      context: Context,
      info
    ) => context.movementService.list(args.offset, args.limit, args.where),
    movement: (parent, args: { id: string }, context: Context, info) => context.movementService.get(args.id)
  },
  Mutation: {
    createMovement: (parent, args: { input: Omit<Movement, "id"> }, context: Context, info) =>
      context.movementService.create(args.input),
    updateMovement: (parent, args: { input: Partial<Movement> & { id: string } }, context: Context, info) =>
      context.movementService.update(args.input),
    deleteMovement: async (parent, args: { id: string }, context: Context, info) => {
      const deletedId = await context.movementService.remove(args.id);
      return deletedId ? { id: deletedId } : null;
    }
  },
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value); // ast value is always in string format
      }
      return null;
    }
  })
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
(async () => {
  const { movementCollection } = await getCollectionsGateway();
  const movementService = MovementService(movementCollection);

  const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ movementService }) });

  // This `listen` method launches a web-server.  Existing apps
  // can utilize middleware options, which we'll discuss later.
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
