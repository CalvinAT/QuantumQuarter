const express = require('express');
const app = express();
const config = require('./config');
const db = require('./dbConnection');
const cors = require('cors');

const routes = require('./routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://202.125.200.1:5500');
  next();
});

app.listen(config.port, () => {
  console.log(`Server is running at http://localhost:${config.port}`);
});


module.exports =  app; 