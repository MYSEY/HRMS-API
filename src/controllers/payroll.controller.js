const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { Math } from "core-js";
import JWTProvider from "../utils/jwt-provider";
const { Op } = require('sequelize');

const Payroll = db.Payroll;
const User = db.user;

const getPayrolls = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Payrolls']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { page = 1, page_size = 10 } = req.query;

    // let limit = parseInt(page_size);
    // let offset = (page - 1) * limit;
    const user = JWTProvider.getTokenUser(req);
    
    try {
        // Count the total number of Payroll
        const data = await Payroll.findAndCountAll();

        // Calculate total pages
        // let pages = Math.ceil(data.count / limit);
        // console.log("user id: ",user.Auth.id);
        const payrolls = await Payroll.findAll({
            where:{ "employee_id": user.Auth.id},
            // attributes: [],
            include: [
                {
                    model: User,
                    attributes: ['pre_salary','basic_salary','salary_increas'],
                    required: false,
                },
            ],
            order: [['id', 'DESC']],
        });

        // Respond with data
        res.status(200).json({
            datas: payrolls,
            count: data.count,
        });

    } catch (error) {
        console.error('Error:', error.message); // Log detailed error
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
const getPayrollId = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Payrolls']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const user = JWTProvider.getTokenUser(req);
    const payroll = await Payroll.findOne({ where:{ "employee_id": user.Auth.id},order: [['payment_date', 'DESC']], });
    // const payroll = await Payroll.findOne({ where:{ "employee_id": user.Auth.id}});
    if (!payroll) return next(new HttpBadRequest("Payroll not found", 404));
    res.status(200).json({
        'status': true,
        'data': payroll
    })
});

module.exports = {
    getPayrolls,
    getPayrollId
};