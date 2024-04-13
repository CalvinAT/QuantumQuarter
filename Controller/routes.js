const express = require('express');
const router = express.Router();
const multer = require('multer');

const { addPropertyHandler, getPropertyHandler, setStatusPropertyHandler } = require('./handlers/propertyHandler')
const {addEmployee, updateAgentProfile} = require('./handlers/employeeHandler');
const { login, logout } = require('./handlers/loginHandler');
const countMortgageSimulation = require('./handlers/mortgageHandler');
const {getFeedback, addFeedback} = require('./handlers/feedbackHandler')
const upload = multer({ dest: 'uploads/' });

router.post('/property', upload.array('images',5), addPropertyHandler);
router.get('/property', upload.none(), getPropertyHandler);
router.put('/property', upload.none(), setStatusPropertyHandler);
router.delete('/property', upload.none(), setStatusPropertyHandler);

router.post('/employee', upload.single('image'), addEmployee);

router.put('/agent', upload.none(), updateAgentProfile);

router.post('/login', upload.none(), login)

router.get('/logout', upload.none(), logout)

router.post('/mortgage', upload.none(), countMortgageSimulation)

router.post('/feedback', upload.none(), addFeedback)
router.get('/feedback', upload.none(), getFeedback)

module.exports = router;