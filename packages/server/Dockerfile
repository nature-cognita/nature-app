FROM node:lts-alpine
WORKDIR /app

COPY package.json /app/

RUN yarn install --production

COPY tsconfig.json /app/

COPY prisma /app/prisma
COPY src /app/src

CMD yarn start


