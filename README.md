# Wiki Feats

WikiFeats is a web app that delivers Wikipedia's Featured Contents.

## Technical Stack

- Common
  - Typescript
  - NodeJS + PNPM

- Front-End
  - React.js
  - Ant Design
  - React Query + Axios
  - Vitest + Testing Library

- Back-End
  - NestJS
  - MikroORM
  - PostgreSQL
  - Axios
  - NestJS Testing + Jest

## Getting Started

To see installation details for each app, please refer to the corresponding documentation.

- [Back-End Documentation](backend/README.md)
- [Front-End Documentation](frontend/README.md)

## Build and Run

``` bash
# Creates a deployable unit in docker
$ pnpm run docker-compose:up
```

## Project Structure

![Project Structure](/images/project-structure.png)

The project is structured around three core components: Front-End, Back-End, and Database.

Front-End: The user interface built with React.js, styled with Ant Design, and managed with React Query for state management and Axios for API requests.

Back-End: The server-side logic implemented using NestJS. It is responsible for interfacing with the [Wikipedia's Featured Content API](https://api.wikimedia.org/wiki/Feed_API/Reference/Featured_content) to retrieve featured articles for a specified date. Once fetched, these articles are stored in the PostgreSQL database to facilitate faster and more efficient access.

Database: A PostgreSQL database that serves as a persistent storage system for the featured articles. This database is accessed and managed through MikroORM within the NestJS application.

When a request is made for articles in a language not already present in the database, the Back-End utilizes the LibreTranslate API to translate the original English articles into the requested language. This ensures that users can access Wikipedia's featured content in various languages, even if those translations are not directly available from the original API.