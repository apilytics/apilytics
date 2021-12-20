# Apilytics Landing Page 📈

[![ci](https://github.com/blomqma/apilytics-landing-page/actions/workflows/ci.yml/badge.svg)](https://github.com/blomqma/apilytics-landing-page/actions)

## Prerequisites

- [Docker](https://www.docker.com)

- [Node.js](https://nodejs.org) - (preferably v14.x since that's used in prod)

- [Yarn](https://yarnpkg.com)

## Get the development environment up and running

1. Clone this repository with: `git clone git@github.com:blomqma/apilytics-landing-page.git`

2. `cd apilytics-landing-page`

3. [Follow the instructions for environment variables](#environment-variables)

4. Build the images: `docker-compose build`

5. Run the app: `docker-compose up`

7. Access the application from [localhost:3000](http://localhost:3000)

## Environment variables

- Copy the template env file: `cp .env.template .env` and add values for the \<placeholder\> variables in the `.env` file.

## Troubleshooting

### My dependencies are not getting loaded from the built image?

1. Run `docker-compose build`
2. Run `docker-compose up -V`, (same as [`--renew-anow-volumes`](https://docs.docker.com/compose/reference/up/)) this forces the anonymous `node_modules` volume to update its contents from the freshly built image.
3. 🍻

### My editor doesn't pick up latest Prisma typings?

1. Run `yarn prismage generate` outside the container, so the types matching the latest migrations populate your local `node_modules`.
2. 🍻
