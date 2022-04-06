import { gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/federation";
import { resolvers } from "./resolvers";

const typeDefs = gql`
  extend type USER_User @key(fields: "id") {
    id: ID! @external

    todoItems: [TODO_TodoItem]
  }

  type Query {
    TODO_getTodoItemById(id: ID!): TODO_TodoItem
    TODO_listTodoItems: [TODO_TodoItem]
  }

  type TODO_TodoItem @key(fields: "id") {
    id: ID!
    name: String
    user: USER_User! @external
  }

  input TODO_CreateTodoItemInput {
    name: String
    userId: ID
  }

  type Mutation {
    TODO_createTodoItem(input: TODO_CreateTodoItemInput!): TODO_TodoItem
  }
`;

export const schema = buildSubgraphSchema({ typeDefs, resolvers });
