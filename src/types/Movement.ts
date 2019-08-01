import { ObjectID } from "mongodb";

export enum MovementType {
  FOOD = "FOOD",
  PUBLIC_TRANSPORT = "PUBLIC_TRANSPORT",
  FUEL = "FUEL",
  FUN = "FUN",
  MUTUO = "MUTUO",
  SPESE_CONDOMINIALI = "SPESE_CONDOMINIALI",
  STIPENDIO = "STIPENDIO",
  OTHER = "OTHER"
}

export interface MovementDB {
  _id: ObjectID;
  amount: number;
  description?: string;
  type: MovementType;
  date: Date;
  userId: string;
}

export type Movement = Omit<MovementDB, "_id"> & { id: string };
