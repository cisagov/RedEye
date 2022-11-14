FROM node:16 as redeye-builder

WORKDIR /app
COPY ./ ./

RUN yarn install --immutable --inline-builds
RUN npx pkg-fetch --platform mac --node-range node16
RUN npx pkg-fetch --platform linux --node-range node16
RUN npx pkg-fetch --platform win --node-range node16
RUN yarn run release:all

FROM node:16 as redeye-linux-builder

WORKDIR /app
COPY ./ ./

RUN yarn install --immutable --inline-builds
RUN npx pkg-fetch --platform linux --node-range node16
RUN yarn run release --platform=linux

### CORE IMAGE ###
FROM ubuntu as redeye-core
WORKDIR /app
COPY --from=redeye-linux-builder /app/release/linux .
ENTRYPOINT [ "/bin/bash", "-l", "-c" ]
CMD ["./RedEye"]