FROM node:14.18.2-buster-slim

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update \
    && apt-get install --no-install-recommends --assume-yes \
        libssl-dev \
    && rm -rf /var/lib/apt/lists/ /var/cache/apt/

RUN mkdir .next

ENV NODE_ENV=development

COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile && yarn cache clean

COPY prisma prisma/
RUN yarn prisma generate

CMD ["yarn", "dev"]
