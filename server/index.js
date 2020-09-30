const app = require('./app');
require('dotenv').config();
const port = 3002

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})