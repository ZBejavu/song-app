# docker build . -t songappserver
# FROM node:12 as builder

# # install and cache app dependencies
# COPY /songclient/package.json /songclient/package-lock.json ./
# RUN npm ci --only=production

# COPY /songclient ./

# RUN INLINE_RUNTIME_CHUNK=false npm run build

FROM node:12

# WORKDIR /songclient/build

# COPY --from=builder ./build .

WORKDIR /songclient/build

ADD /songclient/build .

WORKDIR /server

COPY /server/package.json /songclient/package-lock.json ./

RUN npm install --production

RUN npm rebuild bcrypt --build-from-source

RUN git clone https://github.com/vishnubob/wait-for-it.git

EXPOSE 8080

COPY /server .

CMD ["./wait-for-it/wait-for-it.sh", "mysql:3306", "--", "npm", "run", "spinup"]