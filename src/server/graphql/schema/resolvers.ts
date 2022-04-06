import { ITodoItem, TodoItemService } from "../../../service/todoItem";

const todoItemService = new TodoItemService();

export const resolvers = {
  Query: {
    TODO_getTodoItemById(_: any, { id }: { id: string }) {
      return todoItemService.findById(TodoItemService.fromGlobalId(id));
    },
    TODO_listTodoItems() {
      return todoItemService.list();
    },
  },
  TODO_TodoItem: {
    __resolveReference({ id }: { id: string }) {
      return todoItemService.findById(TodoItemService.fromGlobalId(id));
    },
    id: (todoItem: ITodoItem) => TodoItemService.toGlobalId(todoItem.id),
    user: (todoItem: ITodoItem) => ({
      __typename: "USER_User",
      id: todoItem.userId,
    }),
  },
  Mutation: {
    TODO_createTodoItem(_: any, { input }: any) {
      return todoItemService.create(input);
    },
  },
  USER_User: {
    todoItems(user: { id: string }) {
      return todoItemService.listByUserId(user.id);
    },
  },
};
