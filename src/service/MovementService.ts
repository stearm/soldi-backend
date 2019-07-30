import { ListMovementsWhere } from "./../types/MovementWhere";
import { MongoClient, Collection, ObjectID } from "mongodb";
import { Movement, MovementDB, MovementType } from "../types/Movement";
import { MovementList } from "../types/MovementList";

/**
 * Useful resource: https://www.guru99.com/node-js-mongodb.html
 */

export interface MovementServiceT {
  list: (offset: number | null, limit: number | null, where: ListMovementsWhere | null) => Promise<MovementList>;
  create: (movement: Omit<Movement, "id">) => Promise<Movement | null>;
  update: (movement: Partial<Movement> & { id: string }) => Promise<Movement | null>;
  remove: (id: string) => Promise<string | null>;
  get: (id: string) => Promise<Movement | null>;
}

const normalizeId = <T extends { _id: ObjectID }>(obj: T): any => {
  return {
    id: obj._id.toHexString(),
    ...Object.keys(obj)
      .filter(k => k !== "_id")
      .reduce((prev, next) => ({ ...prev, [next]: obj[next] }), {})
  };
};

export const MovementService = (collection: Collection<MovementDB>): MovementServiceT => {
  const list = async (
    offset: number | null,
    limit: number | null,
    where: ListMovementsWhere | null
  ): Promise<MovementList> => {
    let filter = {};
    if (where) {
      if (where.type) {
        filter = { ...filter, type: where.type };
      }

      if (where.from) {
        filter = { ...filter, from: where.from };
      }

      if (where.to) {
        filter = { ...filter, from: where.to };
      }
    }

    let movementsQ = collection.find(filter);

    if (offset) {
      movementsQ = movementsQ.skip(offset);
    }

    if (limit) {
      movementsQ = movementsQ.limit(limit);
    }

    const movements: Array<Movement> = await movementsQ.toArray().then(mDbs => mDbs.map(normalizeId));

    return {
      content: movements,
      count: 0,
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: false
      }
    };
  };

  const create = async (movement: Omit<Movement, "id">): Promise<Movement | null> => {
    const result = await collection.insertOne({
      _id: new ObjectID(),
      amount: movement.amount,
      date: movement.date || new Date(),
      description: movement.description,
      type: movement.type
    });

    return get(result.insertedId.toHexString());
  };

  const update = async (movement: Partial<Movement> & { id: string }): Promise<Movement | null> => {
    const { id, ...rest } = movement;
    try {
      await collection.updateOne({ _id: new ObjectID(movement.id) }, { $set: { ...rest } });

      const updatedMovement = await collection.findOne({ _id: new ObjectID(id) });
      return updatedMovement ? normalizeId(updatedMovement) : null;
    } catch (err) {
      throw new Error(`Cannot update movement with id ${id}`);
    }
  };

  const remove = async (id: string): Promise<string | null> => {
    try {
      const result = await collection.deleteOne({
        _id: new ObjectID(id)
      });

      return result.deletedCount === 1 ? id : null;
    } catch (err) {
      throw new Error(`Cannot delete movement with id ${id}`);
    }
  };

  const get = async (id: string): Promise<Movement | null> => {
    const movement = await collection.findOne({
      _id: new ObjectID(id)
    });

    return movement ? normalizeId(movement) : null;
  };

  return { list, create, update, remove, get };
};
