# Apilytics 📈

[![ci](https://github.com/blomqma/apilytics/actions/workflows/ci.yml/badge.svg)](https://github.com/blomqma/apilytics/actions)

## Prerequisites

- [Docker](https://www.docker.com)

- [Node.js](https://nodejs.org) - (preferably v14.x since that's used in prod)

- [Yarn](https://yarnpkg.com)

## Get the development environment up and running

1. Clone this repository with: `git clone git@github.com:blomqma/apilytics.git`

2. `cd apilytics`

3. [Follow the instructions for environment variables](#environment-variables)

4. Build the images: `docker-compose build`

5. Run the app: `docker-compose up`

6. Access the application from [localhost:3000](http://localhost:3000)

## Environment variables

- Copy the template env file: `cp .env.template .env` and add values for the \<placeholder\> variables in the `.env` file.

## Seeding database with test data

- Run `yarn prisma db seed` (or `yarn prisma:seed`) to manually seed your database with the seeding script in `src/prisma/seed.ts`. The script will also be automatically run with `prisma migrate dev` and `prisma migrate reset`. More info at: https://www.prisma.io/docs/guides/database/seed-database

## Troubleshooting

### My dependencies are not getting loaded from the built image?

1. Run `docker-compose build`
2. Run `docker-compose up -V`, (same as [`--renew-anow-volumes`](https://docs.docker.com/compose/reference/up/)) this forces the anonymous `node_modules` volume to update its contents from the freshly built image.
3. 🍻

### My editor doesn't pick up latest Prisma typings?

1. Run `yarn prisma generate` (or `yarn prisma:generate`) outside the container, so the types matching the latest migrations populate your local `node_modules`.
2. 🍻
