const express = require('express');
const { validate } = require('express-validation');
const {    
    getLeaveTypes,
} = require('../controllers/leave_type.controller');
// const { roleCreateRequest, roleUpdateRequest } = require('../validation/Role');

const router = express.Router();

router.get('/view', getLeaveTypes);
module.exports = router;