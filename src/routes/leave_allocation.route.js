const express = require('express');
const { validate } = require('express-validation');
const {    
    getLeaveAllocationId,
} = require('../controllers/leave_allocation.controller');
// const { roleCreateRequest, roleUpdateRequest } = require('../validation/Role');

const router = express.Router();

router.get('/view', getLeaveAllocationId);
module.exports = router;