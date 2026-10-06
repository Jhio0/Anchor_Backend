FROM node:24

WORKDIR /app

COPY . .

RUN corepack enable
RUN CI=true pnpm install --frozen-lockfile

RUN pnpm --dir myLibrary build
RUN pnpm build

CMD ["pnpm", "start"]