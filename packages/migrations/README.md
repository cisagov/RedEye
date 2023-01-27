# migrations

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build migrations` to build the library.

## Creating Migrations

1. If you've changed something in the `@redeye/models` library, run `yarn run create-migrations`
2. Update the DB configs in `src/db-config.ts` by importing the generated migration class and add it to the `migrationsList` array 
