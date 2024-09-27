const express = require('express');
const { validate } = require('express-validation');
const {    
    getBanks,
    getBankId,
} = require('../controllers/bank.controller');

const router = express.Router();

router.get('/view', getBanks);
router.get('/view-by-id', getBankId);
module.exports = router;