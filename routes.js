const express = require('express');
const router = express.Router();
const multer = require('multer');
const addProperty = require('./handlers/addProperty');
const upload = multer();

router.post('/addproperty', upload.none(), addProperty);

module.exports = router;