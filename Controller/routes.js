const express = require('express');
const router = express.Router();
const multer = require('multer');

const { addPropertyHandler, getPropertyHandler, setStatusPropertyHandler } = require('./handlers/propertyHandler')
const addEmployee = require('./handlers/employeeHandler');
const { login, logout } = require('./handlers/loginHandler');
const upload = multer({ dest: 'uploads/' });

router.post('/property', upload.array('images',5), addPropertyHandler);
router.get('/property', upload.none(), getPropertyHandler);
router.put('/property', upload.none(), setStatusPropertyHandler);
router.delete('/property', upload.none(), setStatusPropertyHandler);

router.post('/employee', upload.none(), addEmployee);

router.post('/login', upload.none(), login)

router.get('/logout', upload.none(), logout)

module.exports = router;