import {
  buildServer as buildServerGRPC,
  startServer as startServerGRPC,
} from "./server/grpc";
import {
  buildServer as buildServerInternal,
  startServer as startServerInternal,
} from "./utils/internalServer";

function main() {
  const grpcServer = buildServerGRPC();
  const internalServer = buildServerInternal(grpcServer);

  Promise.all([
    startServerGRPC(grpcServer),
    startServerInternal(internalServer),
  ]);
}
main();
