const express = require('express');
const app = express();
const config = require('./config')
const db = require('./dbConnection')

const routes = require('./routes');

app.use(express.json());
app.use(routes);

app.listen(config.port, () => {
  console.log(`Server is running at http://localhost:${config.port}`);
});