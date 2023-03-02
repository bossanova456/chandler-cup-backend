FROM node:latest

RUN apt update && apt upgrade -y

WORKDIR /app
COPY . .
RUN npm install

EXPOSE 3001
CMD ["npm", "start"]