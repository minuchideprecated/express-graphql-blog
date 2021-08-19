FROM node:16

RUN apt-get update && apt -y install libpq-dev

WORKDIR /app
ADD    ./tsconfig.json   /app/
ADD    ./package.json    /app/

RUN    yarn install

ADD    ./config.json     /app/

EXPOSE 8080
