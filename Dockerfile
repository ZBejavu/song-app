# docker build . -t songappserver
FROM node:12

WORKDIR /songclient/build

ADD /songclient/build .

# WORKDIR /songclient

# COPY /songclient .

# RUN npm install --production

# RUN npm run build 

WORKDIR /server

COPY /server .

RUN npm install --production

RUN npm rebuild bcrypt --build-from-source

RUN git clone https://github.com/vishnubob/wait-for-it.git

EXPOSE 8080

CMD ["node", "."]