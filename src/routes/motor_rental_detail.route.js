const express = require('express');
const { validate } = require('express-validation');
const {    
    getMotorRentalDetails,
    getMotorRentalDetailId,
} = require('../controllers/motor_rental_detail.controller');

const router = express.Router();

router.get('/view', getMotorRentalDetails);
router.get('/view-by-id', getMotorRentalDetailId);
module.exports = router;