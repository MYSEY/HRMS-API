const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { Math } from "core-js";

const Bank = db.Bank;

const getBanks = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Banks']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { page = 1, page_size = 10 } = req.query;

    let limit = parseInt(page_size);
    let offset = (page - 1) * limit;
    
    try {
        // Count the total number of Exchange Rates
        const data = await Bank.findAndCountAll();

        // Calculate total pages
        let pages = Math.ceil(data.count / limit);

        const Banks = await Bank.findAll({
            limit: limit,
            offset: offset,
            // attributes: [],
            order: [['id', 'DESC']],
        });

        // Respond with data
        res.status(200).json({
            datas: Banks,
            count: data.count,
            pages: pages,
            current_page: page
        });

    } catch (error) {
        console.error('Error:', error.message); // Log detailed error
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
const getBankId = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Banks']
    * #swagger.security = [{"bearerAuth": []}]
    */
    let { id } = req.query;
    const bank = await Bank.findOne({where: { id } });
    if (!bank) return next(new HttpBadRequest("Bank not found", 404));
    res.status(200).json({
        'status': true,
        'data': bank
    })
});

module.exports = {
    getBanks,
    getBankId
};