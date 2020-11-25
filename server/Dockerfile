# docker build . -t songappserver
# FROM node:12

# # WORKDIR /songclient

# # COPY ../songclient .

# # RUN npm install --production

# # RUN npm run build 

# WORKDIR /server

# COPY . .

# RUN npm install --production

# RUN git clone https://github.com/vishnubob/wait-for-it.git

# EXPOSE 5000

# CMD ["node", "."]

FROM node:12

WORKDIR /server

COPY . .

RUN npm install --production

CMD ["npx", "sequelize", "db:seed:all"]