# Wiki Feats Back-End

Proxy API to consume and provide content from the Wikipedia Featured Content API powered by NestJS.

## Getting Started

First install the dependencies:

```bash
$ pnpm install
```

Afterwards copy the .env.sample into an .env file and fill out your own environment values.

```bash
$ cp .env.sample .env
```

Run the app in watch mode with:

``` bash
$ pnpm run start:dev
```

The API documentation should be running in `http://localhost:{PORT}/api`.

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Orm Commands

```bash
# create migration
$ pnpm run migration:create {name}

# run migration
$ pnpm run migration:up

# revert one migration
$ pnpm run migration:down

# drop the database
$ pnpm run schema:drop
```