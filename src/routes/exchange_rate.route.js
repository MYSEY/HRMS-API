const express = require('express');
const { validate } = require('express-validation');
const {    
    getExchangeRates,
    getExchangeRateId,
} = require('../controllers/exchange_rate.controller');
// const { roleCreateRequest, roleUpdateRequest } = require('../validation/Role');

const router = express.Router();

router.get('/view', getExchangeRates);
router.get('/view-by-id', getExchangeRateId);
module.exports = router;