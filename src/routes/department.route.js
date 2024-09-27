const express = require('express');
const { validate } = require('express-validation');
const {    
    getDepartments,
    getDepartmentId,
} = require('../controllers/department.controller');

const router = express.Router();

router.get('/view', getDepartments);
router.get('/view-by-id', getDepartmentId);
module.exports = router;