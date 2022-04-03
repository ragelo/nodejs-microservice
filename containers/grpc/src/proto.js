const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const core = require('@microservice/core')

const packageDefinition = protoLoader.loadSync("./proto/date.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})
const grcpObject = grpc.loadPackageDefinition(packageDefinition);
  
module.exports = {
    services: [{
        definition: grcpObject.DateService.service,
        implementation: {
            today(_, callback) {
                callback(null, {
                    iso: core.getISODate(),
                });
            }
        },
    }],
};