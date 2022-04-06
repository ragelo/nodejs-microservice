import {
  buildServer as buildServerGRPC,
  startServer as startServerGRPC,
} from "./server/grpc";
import {
  buildServer as buildServerGraphQL,
  startServer as startServerGraphQL,
} from "./server/graphql";
import {
  buildServer as buildServerInternal,
  startServer as startServerInternal,
} from "./utils/internalServer";

function main() {
  Promise.all([
    startServerGRPC(buildServerGRPC()),
    startServerGraphQL(buildServerGraphQL()),
  ]).then(([grpcServerManager, gqlServerManager]) => {
    const internalServer = buildServerInternal({
      grpcServer: grpcServerManager,
      gqlServer: gqlServerManager,
    });
    return startServerInternal(internalServer);
  });
}
main();
