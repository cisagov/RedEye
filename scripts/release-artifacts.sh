docker-compose -f ../docker-compose.yml up -d redeye-artifacts
docker create -ti --name redeye-artifacts redeye-builder bash
docker cp redeye-artifacts:/app/release ./artifacts
docker rm -f artifacts