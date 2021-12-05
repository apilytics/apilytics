FROM node:17-buster-slim@sha256:00b4a6297e8e0ecc8d49e3615a7fa613a44568d64b9fa0e11af11131a4dd57ce AS base

RUN groupadd --gid=10001 user \
    && useradd --gid=user --uid=10000 --create-home user
WORKDIR /home/user/app
RUN chown user:user /home/user/app

ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update \
    && apt-get install --no-install-recommends --assume-yes \
        libssl-dev \
    && rm -rf /var/lib/apt/lists/ /var/cache/apt/

FROM base as dev

USER user

RUN mkdir .next

COPY --chown=user:user package.json .
COPY --chown=user:user yarn.lock .
COPY --chown=user:user prisma prisma/

ENV NODE_ENV=development

RUN yarn install --frozen-lockfile && yarn cache clean

CMD ["yarn", "dev"]


FROM dev AS ci

COPY --chown=user:user . .

CMD yarn lint \
    && yarn tsc \
    && yarn build


FROM base as build

# Build with dev dependencies installed so e.g. typescript transpiling works.
COPY --chown=user:user package.json .
COPY --chown=user:user yarn.lock .
COPY --chown=user:user prisma prisma/
RUN yarn install --frozen-lockfile && yarn cache clean

COPY --chown=user:user . .
RUN yarn build

# Get rid of all dev dependencies.
RUN yarn install --frozen-lockfile --production --ignore-scripts --prefer-offline


FROM base as prod

ENV NODE_ENV=production
ENV PATH="/home/user/app/node_modules/.bin:${PATH}"

# The production app needs exactly these and nothing more.
COPY --from=build --chown=user:user /home/user/app/.next .next/
COPY --from=build --chown=user:user /home/user/app/node_modules node_modules/
COPY --from=build --chown=user:user /home/user/app/public public/
COPY --from=build --chown=user:user /home/user/app/next.config.js next.config.js
COPY --from=build --chown=user:user /home/user/app/prisma prisma/

CMD prisma migrate deploy \
    && next start