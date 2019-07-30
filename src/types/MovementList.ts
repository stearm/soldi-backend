import { Movement } from "./Movement";

interface PageInfo {
  hasPreviousPage: Boolean;
  hasNextPage: Boolean;
}

export interface MovementList {
  content: Array<Movement>;
  pageInfo: PageInfo;
  count: number;
}
