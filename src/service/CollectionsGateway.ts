import { MovementDB } from "./../types/Movement";
import { MongoClient, Collection } from "mongodb";

type Collections = { movementCollection: Collection<MovementDB> };

export const getCollectionsGateway = async (): Promise<Collections> => {
  const client: MongoClient = await MongoClient.connect("mongodb://localhost:27017");
  const db = client.db("config");
  const movementCollection = db.collection<MovementDB>("movement");

  return { movementCollection };
};
