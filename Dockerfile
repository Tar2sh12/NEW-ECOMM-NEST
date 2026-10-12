FROM node:22-alpine as base

WORKDIR /app

# Enable pnpm through Corepack
# Corepack enable you to use pnpm inside the Docker container without installing it globally using a separate npm install -g pnpm command.
RUN corepack enable
#How does this work in Docker?

# FROM node:22-alpine as base 
# Start with the Node.js base image
#      |
#      v
# RUN corepack enable
# Enable package-manager commands
#      |
#      v      
# RUN pnpm install
# Install project dependencies


COPY package.json pnpm-lock.yaml ./
# Copy the package files to the working directory

# -----------------------development stage--------------------------

FROM base as development 
#            ^___development here is the stage name we have given in the docker-compose-dev file to the field "target: development"
ENV NODE_ENV=.development

RUN npm install --frozen-lockfile

COPY . .

CMD [ "npm", "run", "start:dev" ]

# -----------------------production stage--------------------------

FROM base as production
#            ^___production here is the stage name we have given in the docker-compose-prod file to the field "target: production"
ENV NODE_ENV=.production
RUN npm install --only=production

COPY . .

CMD [ "npm", "run", "start:prod"]



# ---------------- BUILD ----------------

FROM base AS builder

RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

