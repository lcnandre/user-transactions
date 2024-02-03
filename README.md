# User Transactions API

REST API to register monetary transactions.


## Stack

- Typescript
- Node.jS 18
- NestJS 10
- Fastify
- Helm
- Swagger
- MikroORM
- SQLite


## Requirements
The project requires [Node.JS](https://nodejs.org/) to run.


## Running the project

To run the project, first create a `.env` file according to [.env.template](./.env.template) and run the following commands:

```
npm install
npx mikro-orm migration:up
npm run start:dev
```

After running, the API will be available at http://localhost:3000 by default.

To run the unit tests with code coverage report:

`npm run test:cov`

After coverage is collected, a report will be available on the `coverage/lcov-report/index.html` directory.
