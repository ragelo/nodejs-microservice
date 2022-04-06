import { fromGlobalId } from "graphql-relay";
import { ValidationError } from "./errors";

export { toGlobalId } from "graphql-relay";

export function fromGlobalIdWithTypeCheck(
  globalId: string,
  expectedType: string
) {
  const { id, type } = fromGlobalId(globalId);
  if (type !== expectedType) {
    throw new ValidationError("Invalid id");
  }
  return id;
}
