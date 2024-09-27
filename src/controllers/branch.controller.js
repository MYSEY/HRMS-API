const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { Math } from "core-js";

const Branch = db.Branch;

const getBranchs = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Branchs']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { page = 1, page_size = 10 } = req.query;

    let limit = parseInt(page_size);
    let offset = (page - 1) * limit;
    
    try {
        // Count the total number of Exchange Rates
        const data = await Branch.findAndCountAll();

        // Calculate total pages
        let pages = Math.ceil(data.count / limit);

        const Branchs = await Branch.findAll({
            limit: limit,
            offset: offset,
            // attributes: [],
            order: [['id', 'DESC']],
        });

        // Respond with data
        res.status(200).json({
            datas: Branchs,
            count: data.count,
            pages: pages,
            current_page: page
        });

    } catch (error) {
        console.error('Error:', error.message); // Log detailed error
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
const getBranchId = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Branchs']
    * #swagger.security = [{"bearerAuth": []}]
    */
    let { id } = req.query;
    const Branch = await Branch.findOne({where: { id } });
    if (!Branch) return next(new HttpBadRequest("Branch not found", 404));
    res.status(200).json({
        'status': true,
        'data': Branch
    })
});

module.exports = {
    getBranchs,
    getBranchId
};