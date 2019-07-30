import { Collection } from "mongodb";
import { Balance, BalanceDB } from "../types/Balance";

export interface BalanceServiceT {
  init: (amount: number) => Promise<Balance | null>;
  balance: (owner: string) => Promise<Balance | null>;
}

export const BalanceService = (collection: Collection<BalanceDB>): BalanceServiceT => {
  const init: (amount: number) => {};
  const balance: (owner: string) => {};

  return { init, balance };
};
