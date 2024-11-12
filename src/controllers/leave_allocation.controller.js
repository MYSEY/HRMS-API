const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import JWTProvider from "../utils/jwt-provider";

const LeaveAllocation = db.LeaveAllocation;
const getLeaveAllocationId = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Leave Allocationm']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const user = JWTProvider.getTokenUser(req);
    // const Leave_allocation = await LeaveAllocation.findOne({where:{ employee_id: user.Auth.id}, });
    const Leave_allocation = await LeaveAllocation.findOne({where:{ employee_id: 7}});
    if (!Leave_allocation) return next(new HttpBadRequest("Leave Allocation not found", 404));
    res.status(200).json({
        'status': true,
        'datas': Leave_allocation
    })
});
module.exports = {
    getLeaveAllocationId
};