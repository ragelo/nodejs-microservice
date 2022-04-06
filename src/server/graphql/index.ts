import { ApolloServer, gql } from "apollo-server";
import { ServerManager } from "../../utils/internalServer";
import { schema } from "./schema";

export function buildServer() {
  return new ApolloServer({
    schema,
  });
}

export function startServer(server: ApolloServer): Promise<ServerManager> {
  const port = process.env.GQL_PORT || 4002;
  return server.listen(port).then(({ url }) => {
    console.log(`GraphQL server running at ${url}`);
    return {
      status: true,
      stop() {
        return server.stop();
      },
    };
  });
}
