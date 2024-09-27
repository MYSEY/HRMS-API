const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { Math } from "core-js";

const ExchangeRate = db.ExchangeRate;

const getExchangeRates = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Exchange Rates']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { page = 1, page_size = 10 } = req.query;

    let limit = parseInt(page_size);
    let offset = (page - 1) * limit;
    
    try {
        // Count the total number of Exchange Rates
        const data = await ExchangeRate.findAndCountAll();

        // Calculate total pages
        let pages = Math.ceil(data.count / limit);

        const ExchangeRates = await ExchangeRate.findAll({
            limit: limit,
            offset: offset,
            // attributes: [],
            order: [['id', 'DESC']],
        });

        // Respond with data
        res.status(200).json({
            datas: ExchangeRates,
            count: data.count,
            pages: pages,
            current_page: page
        });

    } catch (error) {
        console.error('Error:', error.message); // Log detailed error
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
const getExchangeRateId = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Exchange Rates']
    * #swagger.security = [{"bearerAuth": []}]
    */
    let { id } = req.query;
    const exchange_rate = await ExchangeRate.findOne({where: { id } });
    if (!exchange_rate) return next(new HttpBadRequest("Exchange rate not found", 404));
    res.status(200).json({
        'status': true,
        'data': exchange_rate
    })
});

module.exports = {
    getExchangeRates,
    getExchangeRateId
};