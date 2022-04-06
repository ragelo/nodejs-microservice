import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/federation";
import { getISODate } from "../../service/date";
import { ServerManager } from "../../utils/internalServer";

const typeDefs = gql`
  type Query {
    isoDate: String
  }
`;

const resolvers = {
  Query: {
    isoDate() {
      return getISODate();
    },
  },
};

export function buildServer() {
  return new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });
}

export function startServer(server: ApolloServer): Promise<ServerManager> {
  const port = process.env.GQL_PORT || 4002;
  return server.listen(4002).then(({ url }) => {
    console.log(`🚀 Review service ready at ${url}`);
    return {
      status: true,
      stop() {
        return server.stop();
      },
    };
  });
}
