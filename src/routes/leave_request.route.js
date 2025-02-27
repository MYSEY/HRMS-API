const express = require('express');
const { validate } = require('express-validation');
const {    
    getLeaveRequests,
    getLeaveOnbehalfs,
    getLeaveApproves,
    getEmployees,
    createRequestLeave,
    createOnbehalfLeave,
    updateLeaveRequest,
    deleteLeave,
    approveLeave,
    rejectLeave,
} = require('../controllers/leave_request.controller');

const router = express.Router();

router.get('/view', getLeaveRequests);
router.get('/onbehalf', getLeaveOnbehalfs);
router.get('/view-by-id', getLeaveApproves);
router.get('/employees', getEmployees);
router.post('/create', createRequestLeave);
router.post('/onbehlf', createOnbehalfLeave);
router.put('/update', updateLeaveRequest);
router.delete('/delete', deleteLeave);
router.post('/approve', approveLeave);
router.post('/reject', rejectLeave);
module.exports = router;