########################################
## BUILD ###############################
########################################
FROM node:19 as build
WORKDIR /app
ADD package.json package-lock.json ./

# Install all dependencies
RUN npm ci

# Add sources
ADD . .

# Build
RUN npm run clean
RUN npm run build

########################################
## SERVER ##############################
########################################
FROM node:19-alpine as server
WORKDIR /app
ADD package.json package-lock.json ./

ENV NODE_ENV=production
# Install production-only dependencies
RUN npm ci

COPY --from=build /app/dist ./dist

CMD ["node", "dist/server.js"]
