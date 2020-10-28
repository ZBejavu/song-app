FROM node:latest

RUN mkdir -p /app/src

WORKDIR /app/src

COPY package.json .

RUN npm install

COPY . .

RUN git clone https://github.com/vishnubob/wait-for-it.git

EXPOSE 5000

CMD ["node", "index.js"]