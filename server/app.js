const express = require('express')
// const cors = require('cors')
const app = express()
const path = require('path')
const morgan = require('morgan');
const helmet = require('helmet');
// app.use(express.static('../songclient/build'));
// const { Client } = require("@elastic/elasticsearch");
// const client = new Client({
//   cloud: {
//     id: process.env.ELASTIC_ID,
//   },
//   auth: {
//     username: process.env.ELASTIC_USR,
//     password: process.env.ELASTIC_PWD,
//   },
// });

// app.use(cors())
app.use(express.static("../songclient/build"));
app.use(express.json())
app.use(morgan("tiny"));
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.use('/api/', require('./api'))

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../songclient/build", "index.html"));
});


module.exports = app;