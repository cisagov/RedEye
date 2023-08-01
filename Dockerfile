FROM node:16-bullseye as redeye-builder

WORKDIR /app
COPY ./ ./
ENV CYPRESS_INSTALL_BINARY=0
RUN npm install -g pkg
RUN yarn install --immutable --inline-builds
RUN curl -fsSL https://moonrepo.dev/install/moon.sh | bash
RUN moon run server:build client:build cobalt-strike-parser:build
RUN pkg applications/server/package.json -t node16-mac-x64 -o release/mac/RedEye
RUN pkg applications/server/package.json -t node16-linux-x64 -o release/linux/RedEye
RUN pkg applications/server/package.json -t node16-windows-x64 -o release/windows/RedEye
RUN pkg parsers/cobalt-strike-parser/package.json -t node16-mac-x64 -o release/mac/parsers/cobalt-strike-parser
RUN pkg parsers/cobalt-strike-parser/package.json -t node16-linux-x64 -o release/linux/parsers/cobalt-strike-parser
RUN pkg parsers/cobalt-strike-parser/package.json -t node16-windows-x64 -o release/windows/parsers/cobalt-strike-parser
RUN pkg parsers/brute-ratel-parser/package.json -t node16-mac-x64 -o release/mac/parsers/brute-ratel-parser
RUN pkg parsers/brute-ratel-parser/package.json -t node16-linux-x64 -o release/linux/parsers/brute-ratel-parser
RUN pkg parsers/brute-ratel-parser/package.json -t node16-windows-x64 -o release/windows/parsers/brute-ratel-parser
RUN tar -zcvf release.tar.gz ./release/
RUN mkdir outputs
RUN cp release.tar.gz outputs/release.tar.gz

FROM node:16-bullseye as redeye-linux-builder

WORKDIR /app
COPY ./ ./
ENV CYPRESS_INSTALL_BINARY=0
RUN yarn install --immutable --inline-builds
RUN npx pkg-fetch --platform linux --node-range node16
RUN yarn release:linux

### CORE IMAGE ###
FROM debian as redeye-core
WORKDIR /app
COPY --from=redeye-linux-builder /app/release/linux .
ENTRYPOINT [ "/bin/bash", "-l", "-c" ]
CMD ["./RedEye"]
