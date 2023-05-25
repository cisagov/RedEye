FROM node:16-bullseye as redeye-builder

WORKDIR /app
COPY ./ ./
ENV CYPRESS_INSTALL_BINARY=0
RUN npm install -g pkg
RUN yarn install --immutable --inline-builds
RUN curl -fsSL https://moonrepo.dev/install/moon.sh | bash
RUN moon run server:build client:build cs-parser:build
RUN pkg applications/server/package.json -t node18-mac-x64 -o release/mac/RedEye
RUN pkg applications/server/package.json -t node18-linux-x64 -o release/linux/RedEye
RUN pkg applications/server/package.json -t node18-windows-x64 -o release/windows/RedEye
RUN pkg packages/cs-parser/package.json -t node18-mac-x64 -o release/mac/parsers/cs-parser
RUN pkg packages/cs-parser/package.json -t node18-linux-x64 -o release/linux/parsers/cs-parser
RUN pkg packages/cs-parser/package.json -t node18-windows-x64 -o release/windows/parsers/cs-parser
RUN tar -zcvf release.tar.gz ./release/
RUN mkdir outputs
RUN cp release.tar.gz outputs/release.tar.gz

FROM node:16-bullseye as redeye-linux-builder

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
