import { Server, ServerCredentials } from "@grpc/grpc-js";
import { TodoServiceService, TodoServiceImplementation } from "./todo";
import { ServerManager } from "../../utils/internalServer";

export function buildServer() {
  const server = new Server();
  server.addService(TodoServiceService, TodoServiceImplementation);
  return server;
}

export function startServer(server: Server) {
  const port = process.env.GRPC_PORT || 3000;
  return new Promise<ServerManager>((resolve, reject) => {
    server.bindAsync(
      `0.0.0.0:${port}`,
      ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) {
          reject(error);
          return;
        }
        console.log(`gRPC server running at http://0.0.0.0:${port}`);
        resolve({
          status: true,
          async stop() {
            try {
              await new Promise<void>((resolve, reject) => {
                const interval = setTimeout(() => {
                  console.error("GRPC.tryShutdown timeout");
                  reject();
                }, 2000);
                server.tryShutdown((error) => {
                  clearInterval(interval);
                  if (error) {
                    console.error("GRPC.tryShutdown error", error);
                    reject(error);
                  }
                  resolve();
                });
              });
            } catch {
              server.forceShutdown();
            }
          },
        });
        server.start();
      }
    );
  });
}
