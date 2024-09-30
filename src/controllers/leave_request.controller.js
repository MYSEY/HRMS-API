const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { Math } from "core-js";
import JWTProvider from "../utils/jwt-provider";

const LeaveRequest = db.LeaveRequest;

const getLeaveRequests = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Leave Requests']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { page = 1, page_size = 10 } = req.query;

    let limit = parseInt(page_size);
    let offset = (page - 1) * limit;
    const user = JWTProvider.getTokenUser(req);
    
    try {
        // Count the total number of Motor rentals
        const data = await LeaveRequest.findAndCountAll({where:{ employee_id: user.Auth.id}});

        // Calculate total pages
        let pages = Math.ceil(data.count / limit);

        const LeaveRequests = await LeaveRequest.findAll({
            where:{ employee_id: user.Auth.id},
            limit: limit,
            offset: offset,
            // attributes: [],
            order: [['id', 'DESC']],
        });

        // Respond with data
        res.status(200).json({
            datas: LeaveRequests,
            count: data.count,
            pages: pages,
            current_page: page
        });

    } catch (error) {
        console.error('Error:', error.message); // Log detailed error
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
const getLeaveRequestId = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Leave Requests']
    * #swagger.security = [{"bearerAuth": []}]
    */
    let { id } = req.query;
    const LeaveRequest = await LeaveRequest.findOne({where: { id } });
    if (!LeaveRequest) return next(new HttpBadRequest("Leave Request not found", 404));
    res.status(200).json({
        'status': true,
        'data': LeaveRequest
    })
});

module.exports = {
    getLeaveRequests,
    getLeaveRequestId
};