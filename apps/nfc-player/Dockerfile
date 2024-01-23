FROM node:latest

WORKDIR /usr/src/app


COPY ./browser /usr/src/app/dist/apps/nfc-player/browser
COPY ./server /usr/src/app/server

CMD ["node", "server/main.js"]