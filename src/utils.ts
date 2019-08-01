import { ObjectID } from "mongodb";

export const normalizeId = <T extends { _id: ObjectID }>(obj: T): any => {
  return {
    id: obj._id.toHexString(),
    ...Object.keys(obj)
      .filter(k => k !== "_id")
      .reduce((prev, next) => ({ ...prev, [next]: obj[next] }), {})
  };
};
