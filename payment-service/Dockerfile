FROM node:18.18.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY ./src/font/Roboto-Regular.ttf /app/font/Roboto-Regular.ttf

EXPOSE 6000
CMD ["npm", "start"]
