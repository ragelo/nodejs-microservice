import { Server, ServerCredentials } from "@grpc/grpc-js";
import { DateServiceService } from "./proto/date_grpc_pb";
import { DataServiceImplemenation } from "./grpc";

export function buildServer() {
  const server = new Server();
  server.addService(DateServiceService, DataServiceImplemenation);
  return server;
}

export function startServer(server: Server) {
  const port = process.env.GRPC_PORT || 3000;
  server.bindAsync(
    `0.0.0.0:${port}`,
    ServerCredentials.createInsecure(),
    (error, port) => {
      console.log(`gRPC server running at http://0.0.0.0:${port}`);
      server.start();
    }
  );
  return server;
}
