const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { Math } from "core-js";
import JWTProvider from "../utils/jwt-provider";

const LeaveType = db.LeaveType;

const getLeaveTypes = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Leave Type']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { page = 1, page_size = 10 } = req.query;

    let limit = parseInt(page_size);
    let offset = (page - 1) * limit;
    const user = JWTProvider.getTokenUser(req);
    
    try {
        // Count the total number
        const data = await LeaveType.findAndCountAll();

        // Calculate total pages
        let pages = Math.ceil(data.count / limit);

        const LeaveTypes = await LeaveType.findAll({
            limit: limit,
            offset: offset,
            // attributes: [],
            order: [['id', 'DESC']],
        });

        // Respond with data
        res.status(200).json({
            datas: LeaveTypes,
            count: data.count,
            pages: pages,
            current_page: page
        });

    } catch (error) {
        console.error('Error:', error.message); // Log detailed error
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
module.exports = {
    getLeaveTypes
};