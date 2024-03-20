const express = require('express');
const router = express.Router();
const multer = require('multer');
const addProperty = require('./handlers/addProperty');
const addEmployee = require('./handlers/employeeHandler');
const { login, logout } = require('./handlers/loginHandler');
const upload = multer();

router.post('/addproperty', upload.none(), addProperty);

router.post('/addemployee', upload.none(), addEmployee);

router.post('/login', upload.none(), login)

router.get('/logout', upload.none(), logout)

module.exports = router;