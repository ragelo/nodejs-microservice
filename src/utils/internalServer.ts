import { createTerminus } from "@godaddy/terminus";
import express from "express";
import { createServer, Server as HttpServer } from "http";
export interface ServerManager {
  status: boolean;
  stop(): Promise<void>;
}

interface InternalServerConfig {
  grpcServer: ServerManager;
  gqlServer: ServerManager;
}

export function buildServer(config: InternalServerConfig) {
  const server = createServer(express());
  configureServer(server, config);
  return server;
}

export function startServer(server: HttpServer) {
  const port = process.env.INTERNAL_PORT || 4000;
  return new Promise<HttpServer>((resolve, reject) => {
    // TODO: timeout reject
    server.listen(port, () => {
      console.log(`Internal server running at http://0.0.0.0:${port}`);
      resolve(server);
    });
  });
}

function configureServer(httpServer: HttpServer, config: InternalServerConfig) {
  createTerminus(httpServer, {
    healthChecks: {
      "/healthz": async () => {
        return Promise.all([
          Promise.resolve({
            name: "grpc",
            status: config.grpcServer.status,
          }),
          Promise.resolve({
            name: "graphql",
            status: config.gqlServer.status,
          }),
        ]);
      },
    },
    logger: console.error,
    signals: ["SIGTERM", "SIGINT"],
    async beforeShutdown() {
      // Give some time to server in order to finish active requests
      return new Promise((resolve) => {
        setTimeout(resolve, 2000); // 2s
      });
    },
    async onSignal() {
      await Promise.all([config.gqlServer.stop(), config.gqlServer.stop()]);
    },
    // Kill server if it didn't shutdown gracefully
    timeout: 5000, // 5s
    async onShutdown() {
      console.info("Server has been stopped");
    },
  });
}
