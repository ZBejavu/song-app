FROM node:12

WORKDIR /server

COPY ../server .

RUN npm install --production

CMD ["npm", "run", "initialize"]