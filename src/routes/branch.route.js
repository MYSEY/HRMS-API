const express = require('express');
const { validate } = require('express-validation');
const {    
    getBranchs,
    getBranchId,
} = require('../controllers/branch.controller');

const router = express.Router();

router.get('/view', getBranchs);
router.get('/view-by-id', getBranchId);
module.exports = router;