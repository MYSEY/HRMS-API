const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { Math } from "core-js";
import { Sequelize, Op } from "sequelize";

const PublicHoliday = db.PublicHoliday;

const getPublicHolidays = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Public Holidays']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { page = 1, page_size = 10 } = req.query;

    let limit = parseInt(page_size);
    let offset = (page - 1) * limit;
    
    try {
        // Count the total number of Exchange Rates
        const data = await PublicHoliday.findAndCountAll();

        // Calculate total pages
        let pages = Math.ceil(data.count / limit);

        const currentYear = new Date().getFullYear();
        const PublicHolidays = await PublicHoliday.findAll({
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn("YEAR", Sequelize.col("from")), currentYear)
                ]
            }
            // limit: limit,
            // offset: offset,
            // attributes: [],
            // order: [['id', 'DESC']],
        });

        // Respond with data
        res.status(200).json({
            datas: PublicHolidays,
            count: data.count,
            // pages: pages,
            // current_page: page
        });

    } catch (error) {
        console.error('Error:', error.message); // Log detailed error
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
const getPublicHolidayId = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Public Holidays']
    * #swagger.security = [{"bearerAuth": []}]
    */
    let { id } = req.query;
    const PublicHoliday = await PublicHoliday.findOne({where: { id } });
    if (!PublicHoliday) return next(new HttpBadRequest("Exchange rate not found", 404));
    res.status(200).json({
        'status': true,
        'data': PublicHoliday
    })
});

const searchHolidays = async (req, res) => {
    /* #swagger.tags = ['Public Holidays']
    */

    console.log("data: ", req.body);
    try {
        let from_date = req.query.from_date ? new Date(req.query.from_date) : null;
        let to_date = req.query.to_date ? new Date(req.query.to_date) : null;

        const whereCondition = {};
        
        if (from_date) {
            whereCondition.from = { [Op.gte]: from_date };
        }
        if (to_date) {
            whereCondition.to = { [Op.lte]: to_date };
        }

        const data = await PublicHoliday.findAll({ where: whereCondition });

        return res.status(200).json({ datas: data });
    } catch (error) {
        console.error("Error fetching holidays:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    getPublicHolidays,
    getPublicHolidayId,
    searchHolidays,
};