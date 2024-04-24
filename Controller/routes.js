const express = require('express');
const router = express.Router();
const multer = require('multer');

const { addPropertyHandler, getPropertyHandler, setStatusPropertyHandler, getDetailedPropertyHandler } = require('./handlers/propertyHandler')
const { addEmployee, updateAgentProfile, getProfile, getAgent } = require('./handlers/employeeHandler');
const { login, logout ,tesTesting} = require('./handlers/loginHandler');
const countMortgageSimulation = require('./handlers/mortgageHandler');
const {getFeedback, addFeedback} = require('./handlers/feedbackHandler')
const upload = multer({ dest: 'uploads/' });

// property handlers
router.post('/property', upload.array('images',5), addPropertyHandler);
router.post('/getproperty', upload.none(), getPropertyHandler);
router.put('/property', upload.none(), setStatusPropertyHandler);
router.post('/deleteproperty', upload.none(), setStatusPropertyHandler);
router.post('/getdetailedproperty', upload.none(), getDetailedPropertyHandler);

// employee handlers
router.post('/employee', upload.single('image'), addEmployee);
router.post('/getemployee', upload.none(), getProfile);
router.put('/agent', upload.none(), updateAgentProfile);

// login handlers
router.post('/login', upload.none(), login)
router.get('/logout', upload.none(), logout)

// mortgage handlers
router.post('/mortgage', upload.none(), countMortgageSimulation)

// feedback handlers
router.post('/feedback', upload.none(), addFeedback)
router.get('/feedback', upload.none(), getFeedback)

router.post('/test', upload.none(), tesTesting);

module.exports = router;