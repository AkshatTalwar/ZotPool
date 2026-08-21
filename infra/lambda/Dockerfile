FROM node:20-alpine AS builder

WORKDIR /asset
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
COPY infra/lambda ./infra/lambda
RUN ./node_modules/.bin/esbuild ./infra/lambda/match-handler.ts \
    --bundle \
    --platform=node \
    --target=node20 \
    --format=cjs \
    --outfile=dist/index.js

FROM public.ecr.aws/lambda/nodejs:20

COPY --from=builder /asset/dist/index.js ${LAMBDA_TASK_ROOT}/index.js
CMD ["index.handler"]
