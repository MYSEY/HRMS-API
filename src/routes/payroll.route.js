const express = require('express');
const { validate } = require('express-validation');
const {    
    getPayrolls,
    getPayrollId,
} = require('../controllers/payroll.controller');

const router = express.Router();

router.get('/view', getPayrolls);
router.get('/view-by-id', getPayrollId);

module.exports = router;