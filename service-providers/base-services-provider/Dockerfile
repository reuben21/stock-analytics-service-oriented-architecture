FROM node:21-alpine3.17

WORKDIR /base-services-provider
COPY . .
RUN npm install
CMD ["npm", "start"]

EXPOSE 8093