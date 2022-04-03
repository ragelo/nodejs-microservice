const grpc = require("@grpc/grpc-js");
const http = require("http");
const express = require("express");
const { createTerminus } = require("@godaddy/terminus");
const { services } = require("./proto");

function buildGRPCServer() {
  const server = new grpc.Server();
  for (let service of services) {
    server.addService(service.definition, service.implementation);
  }

  const port = process.env.GRPC_PORT || 3000;
  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      console.log(`gRPC server running at http://0.0.0.0:${port}`);
      server.start();
    }
  );
  return server;
}

function buildInternalHTTPServer(grpcServer) {
  const port = process.env.INTERNAL_PORT || 4000;
  const httpServer = http.createServer(express());

  configureServer(httpServer, grpcServer);

  httpServer.listen(port, () => {
    console.log(`Internal server running at http://0.0.0.0:${port}`);
  });
  return httpServer;
}

function configureServer(httpServer, grpcServer) {
  createTerminus(httpServer, {
    healthChecks: {
      "/healthz": async () => {
        return Promise.all([
          Promise.resolve({
            name: "grpc",
            status: grpcServer.started,
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
          resolve();
        });
      }).catch(grpcServer.forceShutdown());
    },
    // Kill server if it didn't shutdown gracefully
    timeout: 5000, // 5s
    async onShutdown() {
      console.info("Server has been stopped");
    },
  });
}

function main() {
  const grpcServer = buildGRPCServer();
  buildInternalHTTPServer(grpcServer);
}
main();
