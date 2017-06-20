FROM node:8.1.2

RUN apt-get update && apt-get install -qq -y python build-essential
COPY package.json /tmp/package.json
RUN cd /tmp && npm install --quiet
RUN mkdir -p /usr/app && cp -a /tmp/node_modules /usr/app

WORKDIR /usr/app
COPY ./ /usr/app/

EXPOSE 3001
