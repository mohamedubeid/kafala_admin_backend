FROM node:20-alpine

# Create app directory

WORKDIR /usr/node-app

ENV NODE_SERVER_PORT=8080
ENV NODE_ENV=prod
ENV CYPRESS_INSTALL_BINARY=0

COPY . .

RUN npm install
RUN npm run --workspace server build
RUN npm run --workspace client build
RUN npm cache clean --force
RUN rm -rf target tmp

EXPOSE 8080

ENTRYPOINT ["node", "/usr/node-app/server/dist/main.js" ]
