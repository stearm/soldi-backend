export interface BalanceDB {
  owner: string;
  amount: number;
}

export type Balance = Omit<BalanceDB, "_id"> & { id: string };
