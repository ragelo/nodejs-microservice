import { createTerminus } from "@godaddy/terminus";
import { Server } from "@grpc/grpc-js";
import express from "express";
import { createServer, Server as HttpServer } from "http";

export function buildServer(grpcServer: Server) {
  const server = createServer(express());
  configureServer(server, grpcServer);
  return server;
}

export function startServer(server: HttpServer) {
  const port = process.env.INTERNAL_PORT || 4000;
  server.listen(port, () => {
    console.log(`Internal server running at http://0.0.0.0:${port}`);
  });
  return server;
}

function configureServer(httpServer: HttpServer, grpcServer: Server) {
  createTerminus(httpServer, {
    healthChecks: {
      "/healthz": async () => {
        return Promise.all([
          Promise.resolve({
            name: "grpc",
            status: true,
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
      await new Promise((resolve, reject) => {
        const interval = setTimeout(() => {
          console.error("GRPC.tryShutdown timeout");
          reject();
        }, 2000);
        grpcServer.tryShutdown((error) => {
          clearInterval(interval);
          if (error) {
            console.error("GRPC.tryShutdown error", error);
            reject(error);
          }
        });
      }).catch(() => grpcServer.forceShutdown());
    },
    // Kill server if it didn't shutdown gracefully
    timeout: 5000, // 5s
    async onShutdown() {
      console.info("Server has been stopped");
    },
  });
}
