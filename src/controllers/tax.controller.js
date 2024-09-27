const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { Math } from "core-js";

const Tax = db.tax;

const getTaxes = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Taxs']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { page = 1, page_size = 10 } = req.query;

    let limit = parseInt(page_size);
    let offset = (page - 1) * limit;
    
    try {
        // Count the total number of taxes
        const data = await Tax.findAndCountAll();

        // Calculate total pages
        let pages = Math.ceil(data.count / limit);

        const taxes = await Tax.findAll({
            limit: limit,
            offset: offset,
            // attributes: [],
            order: [['id', 'DESC']],
        });

        // Respond with data
        res.status(200).json({
            datas: taxes,
            count: data.count,
            pages: pages,
            current_page: page
        });

    } catch (error) {
        console.error('Error:', error.message); // Log detailed error
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
const getTaxId = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Taxs']
    * #swagger.security = [{"bearerAuth": []}]
    */
    let { id } = req.query;
    const tax = await Tax.findOne({where: { id } });
    if (!tax) return next(new HttpBadRequest("Tax not found", 404));
    res.status(200).json({
        'status': true,
        'data': tax
    })
});

module.exports = {
    getTaxes,
    getTaxId
};