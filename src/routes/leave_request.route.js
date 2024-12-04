const express = require('express');
const { validate } = require('express-validation');
const {    
    getLeaveRequests,
    getLeaveRequestId,
    getEmployees,
    createRequestLeave,
    updateLeaveRequest,
    deleteLeave,
} = require('../controllers/leave_request.controller');

const router = express.Router();

router.get('/view', getLeaveRequests);
router.get('/view-by-id', getLeaveRequestId);
router.get('/employees', getEmployees);
router.post('/create', createRequestLeave);
router.put('/update', updateLeaveRequest);
router.delete('/delete', deleteLeave);
module.exports = router;