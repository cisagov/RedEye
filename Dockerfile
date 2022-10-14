FROM node:16 as redeye-builder

WORKDIR /app
COPY ./ ./

RUN yarn install --immutable --inline-builds
RUN yarn run release:all

FROM node:16 as redeye-linux-builder

WORKDIR /app
COPY ./ ./

RUN yarn install --immutable --inline-builds
RUN yarn run release --platform=linux

### CORE IMAGE ###
FROM ubuntu as redeye-core
WORKDIR /app
COPY --from=redeye-linux-builder /app/release/linux .
ENTRYPOINT [ "/bin/bash", "-l", "-c" ]
CMD ["./RedEye"]