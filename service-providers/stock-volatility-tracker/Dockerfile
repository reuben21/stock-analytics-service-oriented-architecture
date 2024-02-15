FROM node:21-alpine3.17

WORKDIR /stock-volatility-tracker
COPY . .
RUN npm install
CMD ["npm", "start"]

EXPOSE 8092