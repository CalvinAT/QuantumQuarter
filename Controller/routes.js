const express = require('express');
const router = express.Router();
const multer = require('multer');

const { addPropertyHandler, getPropertyHandler, approvePropertyHandler } = require('./handlers/propertyHandler')
const addEmployee = require('./handlers/employeeHandler');
const { login, logout } = require('./handlers/loginHandler');
const upload = multer();

router.post('/property', upload.none(), addPropertyHandler);
router.get('/property', upload.none(), getPropertyHandler);
router.put('/property', upload.none(), approvePropertyHandler);

router.post('/employee', upload.none(), addEmployee);

router.post('/login', upload.none(), login)

router.get('/logout', upload.none(), logout)

module.exports = router;