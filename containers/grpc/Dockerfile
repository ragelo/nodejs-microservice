########################################
## BASE ################################
########################################
FROM node:16-alpine as base
WORKDIR /app

ADD package.json package-lock.json ./
ADD containers/grpc/package.json containers/grpc/package.json
# Add package.json of each dependency
ADD packages/core/package.json packages/core/package.json


########################################
## BUILD ###############################
########################################
FROM base as build
# Install all dependencies
RUN npm ci
# Add dependencies
ADD packages/core packages/core
# Add sources
ADD containers/grpc containers/grpc
# TODO: lint and test

########################################
## SERVER ##############################
########################################
FROM base as server
ENV NODE_ENV=production
# Install production-only dependencies
RUN npm ci

COPY --from=build /app/packages ./packages
COPY --from=build /app/containers ./containers

WORKDIR /app/containers/grpc
CMD ["node", "src/index.js"]
