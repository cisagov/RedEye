FROM node:18-bullseye as redeye-builder

WORKDIR /app
ENV CYPRESS_INSTALL_BINARY=0
RUN npm install -g pkg @moonrepo/cli
COPY ./.moon/docker/workspace .
RUN moon docker setup
RUN moon run server:build client:build cobalt-strike-parser:build brute-ratel-parser:build
RUN yarn node scripts/create-release.mjs
RUN tar -zcvf release.tar.gz ./release/
RUN mkdir outputs
RUN cp release.tar.gz outputs/release.tar.gz

FROM node:18-bullseye as redeye-linux-builder

WORKDIR /app
COPY ./ ./
ENV CYPRESS_INSTALL_BINARY=0
RUN yarn install --immutable --inline-builds
RUN npx pkg-fetch --platform linux --node-range node18
RUN yarn release:linux

### CORE IMAGE ###
FROM debian as redeye-core
WORKDIR /app
COPY --from=redeye-linux-builder /app/release/linux .
ENTRYPOINT [ "/bin/bash", "-l", "-c" ]
CMD ["./RedEye"]
