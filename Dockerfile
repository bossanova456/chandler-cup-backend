FROM node:latest

RUN apt-get update && apt-get upgrade -y

WORKDIR /app
COPY . .
RUN npm install

EXPOSE 3001
CMD ["npm", "start"]