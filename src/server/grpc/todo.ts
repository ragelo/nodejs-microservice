import { ITodoServiceServer } from "./proto/todo_grpc_pb";
import { TodoItem } from "./proto/todo_pb";
import { TodoItemService } from "../../service/todoItem";

export { TodoServiceService } from "./proto/todo_grpc_pb";

const todoItemService = new TodoItemService();
export const TodoServiceImplementation: ITodoServiceServer = {
  async createTodoItem(call, callback) {
    const todoItem = await todoItemService.create({
      name: call.request.getName(),
      userId: call.request.getUserid(),
    });
    callback(
      null,
      new TodoItem()
        .setId(TodoItemService.toGlobalId(todoItem.id))
        .setName(todoItem.name)
    );
  },
};
