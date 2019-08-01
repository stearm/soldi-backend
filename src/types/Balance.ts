import { ObjectID } from "mongodb";

export interface BalanceDB {
  _id: ObjectID;
  owner: string;
  amount: number;
}

export type Balance = Omit<BalanceDB, "_id"> & { id: string };
