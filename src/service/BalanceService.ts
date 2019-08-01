import { Collection, ObjectID } from "mongodb";
import { Balance, BalanceDB } from "../types/Balance";
import { normalizeId } from "../utils";
import { MovementDB, Movement } from "../types/Movement";

const currentBalance = (balance: number, movements: Array<Movement>) =>
  movements.reduce((prev, next) => prev + next.amount, balance);

export interface BalanceServiceT {
  init: (amount: number) => Promise<Balance | null>;
  get: (atDate?: number) => Promise<Balance | null>;
}

export const BalanceService = (
  balanceCollection: Collection<BalanceDB>,
  movementCollection: Collection<MovementDB>
): BalanceServiceT => {
  const init = async (amount: number): Promise<Balance | null> => {
    const balance = await balanceCollection.findOne({
      owner: "ste"
    });

    if (!balance) {
      const result = await balanceCollection.insertOne({
        _id: new ObjectID(),
        owner: "ste",
        amount
      });

      return _getById(result.insertedId.toHexString());
    }

    return null;
  };

  const _getById = async (id: string) => {
    const balance = await balanceCollection.findOne({
      _id: new ObjectID(id)
    });

    return balance ? normalizeId(balance) : null;
  };

  const get = async (atDate?: number) => {
    const balance = await balanceCollection.findOne({
      owner: "ste"
    });

    const movementsQ = await movementCollection.find({
      userId: "ste",
      date: { $lte: new Date(atDate || Date.now()) }
    });

    const movements: Array<Movement> = await movementsQ.toArray().then(mDbs => mDbs.map(normalizeId));

    return balance ? normalizeId({ ...balance, amount: currentBalance(balance.amount, movements) }) : null;
  };

  return { init, get };
};
