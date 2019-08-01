import { Kind } from "graphql/language";
import { GraphQLScalarType } from "graphql";

export const GQLDateType = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  parseValue(value) {
    return new Date(value); // value from the client
  },
  serialize(value) {
    return value.getTime(); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(Number(ast.value)); // ast value is always in string format
    }
  }
});
