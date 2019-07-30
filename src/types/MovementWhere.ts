import { MovementType } from "./Movement";

export interface ListMovementsWhere {
  type?: MovementType;
  from?: number;
  to?: number;
}
