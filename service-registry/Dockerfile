FROM node:21-alpine3.17

WORKDIR /service-registry
COPY . .
RUN npm install

CMD ["npm", "start"]

EXPOSE 8080