const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { Math } from "core-js";

const Department = db.Department;

const getDepartments = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Departments']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { page = 1, page_size = 10 } = req.query;

    let limit = parseInt(page_size);
    let offset = (page - 1) * limit;
    
    try {
        // Count the total number of Exchange Rates
        const data = await Department.findAndCountAll();

        // Calculate total pages
        let pages = Math.ceil(data.count / limit);

        const Departments = await Department.findAll({
            limit: limit,
            offset: offset,
            // attributes: [],
            order: [['id', 'DESC']],
        });

        // Respond with data
        res.status(200).json({
            datas: Departments,
            count: data.count,
            pages: pages,
            current_page: page
        });

    } catch (error) {
        console.error('Error:', error.message); // Log detailed error
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
const getDepartmentId = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Departments']
    * #swagger.security = [{"bearerAuth": []}]
    */
    let { id } = req.query;
    const Department = await Department.findOne({where: { id } });
    if (!Department) return next(new HttpBadRequest("Department not found", 404));
    res.status(200).json({
        'status': true,
        'data': Department
    })
});

module.exports = {
    getDepartments,
    getDepartmentId
};