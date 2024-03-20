const express = require('express');
const router = express.Router();
const multer = require('multer');
const addPropertyHandler = require('./handlers/addPropertyHandler');
const getPropertyHandler = require('./handlers/getPropertyHandler');
const approvePropertyHandler = require('./handlers/approvePropertyHandler');
const upload = multer();

router.post('/property', upload.none(), addPropertyHandler);
router.get('/property', upload.none(), getPropertyHandler);
router.put('/property', upload.none(), approvePropertyHandler);

module.exports = router;