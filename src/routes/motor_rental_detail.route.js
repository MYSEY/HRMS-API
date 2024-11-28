const express = require('express');
const { validate } = require('express-validation');
const {    
    getMotorRentalDetailId,
} = require('../controllers/motor_rental_detail.controller');

const router = express.Router();

router.get('/view-by-id', getMotorRentalDetailId);
module.exports = router;