FROM node:latest

RUN apt-get update && apt-get upgrade -y

WORKDIR /app
COPY . .
RUN npm build

EXPOSE 3001
CMD ["npm", "start"]