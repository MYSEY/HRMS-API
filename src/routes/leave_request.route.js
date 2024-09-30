const express = require('express');
const { validate } = require('express-validation');
const {    
    getLeaveRequests,
    getLeaveRequestId,
} = require('../controllers/leave_request.controller');
// const { roleCreateRequest, roleUpdateRequest } = require('../validation/Role');

const router = express.Router();

router.get('/view', getLeaveRequests);
router.get('/view-by-id', getLeaveRequestId);
module.exports = router;