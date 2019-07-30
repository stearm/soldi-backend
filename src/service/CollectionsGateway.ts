import { BalanceDB } from "./../types/Balance";
import { MovementDB } from "./../types/Movement";
import { MongoClient, Collection } from "mongodb";

type Collections = { movementCollection: Collection<MovementDB>; balanceCollection: Collection<BalanceDB> };

export const getCollectionsGateway = async (): Promise<Collections> => {
  const client: MongoClient = await MongoClient.connect("mongodb://localhost:27017");
  const db = client.db("soldi");
  const movementCollection = db.collection<MovementDB>("movement");
  const balanceCollection = db.collection<BalanceDB>("balance");

  return { movementCollection, balanceCollection };
};
