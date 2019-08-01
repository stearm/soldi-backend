import { ApolloServer } from "apollo-server";

import { typeDefs } from "./gql/TypeDefs";
import { getCollectionsGateway } from "./service/CollectionsGateway";
import { MovementService, MovementServiceT } from "./service/MovementService";
import { ListMovementsWhere } from "./types/MovementWhere";
import { Movement } from "./types/Movement";
import { BalanceService, BalanceServiceT } from "./service/BalanceService";
import { GQLDateType } from "./gql/GQLDateType";

type Context = { movementService: MovementServiceT; balanceService: BalanceServiceT };

const resolvers = {
  Query: {
    movements: (
      parent,
      args: { offset: number | null; limit: number | null; where: ListMovementsWhere | null },
      context: Context,
      info
    ) => context.movementService.list(args.offset, args.limit, args.where),
    movement: (parent, args: { id: string }, context: Context, info) => context.movementService.get(args.id),
    balance: (parent, args: { atDate?: number }, context: Context, info) => context.balanceService.get(args.atDate)
  },
  Mutation: {
    createMovement: (parent, args: { input: Omit<Movement, "id" | "user"> }, context: Context, info) =>
      context.movementService.create(args.input),
    updateMovement: (parent, args: { input: Partial<Movement> & { id: string } }, context: Context, info) =>
      context.movementService.update(args.input),
    deleteMovement: async (parent, args: { id: string }, context: Context, info) => {
      const deletedId = await context.movementService.remove(args.id);
      return deletedId ? { id: deletedId } : null;
    },
    initBalance: (parent, args: { amount: number }, context: Context, info) => context.balanceService.init(args.amount)
  },
  Date: GQLDateType
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
(async () => {
  const { movementCollection, balanceCollection } = await getCollectionsGateway();
  const movementService = MovementService(movementCollection);
  const balanceService = BalanceService(balanceCollection, movementCollection);

  const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ movementService, balanceService }) });

  // This `listen` method launches a web-server.  Existing apps
  // can utilize middleware options, which we'll discuss later.
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
