FROM node:14.18.2-buster-slim@sha256:6fee35e171961ba4557a67f984e0f37d2f931667f1c80fe5b8f3ab9b3cc9c608 AS dev

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update \
    && apt-get install --no-install-recommends --assume-yes \
        libssl-dev \
    && rm -rf /var/lib/apt/lists/ /var/cache/apt/

RUN mkdir .next

COPY package.json .
COPY yarn.lock .
COPY prisma prisma/

ENV NODE_ENV=development

RUN yarn install --frozen-lockfile && yarn cache clean

CMD ["yarn", "dev"]


FROM dev AS ci

COPY . .

CMD yarn lint \
    && yarn tsc \
    && yarn build
