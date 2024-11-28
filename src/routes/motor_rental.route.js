const express = require('express');
const { validate } = require('express-validation');
const {    
    getMotorRentalId,
} = require('../controllers/motor_rental.controller');

const router = express.Router();

router.get('/view-by-id', getMotorRentalId);
module.exports = router;