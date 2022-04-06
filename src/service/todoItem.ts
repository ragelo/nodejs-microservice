import { nanoid } from "nanoid";
import { ValidationError } from "../utils/errors";
import { fromGlobalIdWithTypeCheck, toGlobalId } from "../utils/id";

export interface ITodoItem {
  id: string;
  name: string;
  userId: string;
}

const items: ITodoItem[] = [];

export class TodoItemService {
  static readonly objectName = "TODO_TodoItem";

  static fromGlobalId(globalId: string): string {
    return fromGlobalIdWithTypeCheck(globalId, TodoItemService.objectName);
  }

  static toGlobalId(id: string): string {
    return toGlobalId(TodoItemService.objectName, id);
  }

  async create(input: { name: string; userId: string }): Promise<ITodoItem> {
    if (!input.name) {
      throw new ValidationError("Name cannot be empty");
    }
    if (!input.userId) {
      throw new ValidationError("User ID cannot be empty");
    }
    const item = {
      ...input,
      id: nanoid(),
    };
    items.push(item);
    return item;
  }

  async list() {
    return items;
  }

  async listByUserId(userId: string) {
    return items.filter((item) => item.userId === userId);
  }

  async findById(id: string): Promise<ITodoItem | undefined> {
    return items.find((item) => item.id === id);
  }
}
