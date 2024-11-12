const express = require('express');
const { validate } = require('express-validation');
const {    
    getLeaveRequests,
    getLeaveRequestId,
    getEmployees,
    createRequestLeave,
} = require('../controllers/leave_request.controller');

const router = express.Router();

router.get('/view', getLeaveRequests);
router.get('/view-by-id', getLeaveRequestId);
router.get('/employees', getEmployees);
router.post('/create', createRequestLeave);
module.exports = router;