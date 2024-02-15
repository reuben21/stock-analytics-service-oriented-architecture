FROM node:21-alpine3.17

WORKDIR /service-consumer
COPY . .
RUN npm install

CMD ["npm", "start"]

EXPOSE 443