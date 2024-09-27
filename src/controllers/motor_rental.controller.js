const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { Math } from "core-js";

const MotorRental = db.MotorRental;

const getMotorRentals = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Motor rentals']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { page = 1, page_size = 10 } = req.query;

    let limit = parseInt(page_size);
    let offset = (page - 1) * limit;
    
    try {
        // Count the total number of Motor rentals
        const data = await MotorRental.findAndCountAll();

        // Calculate total pages
        let pages = Math.ceil(data.count / limit);

        const MotorRentals = await MotorRental.findAll({
            limit: limit,
            offset: offset,
            // attributes: [],
            order: [['id', 'DESC']],
        });

        // Respond with data
        res.status(200).json({
            datas: MotorRentals,
            count: data.count,
            pages: pages,
            current_page: page
        });

    } catch (error) {
        console.error('Error:', error.message); // Log detailed error
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
const getMotorRentalId = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Motor rentals']
    * #swagger.security = [{"bearerAuth": []}]
    */
    let { id } = req.query;
    const MotorRental = await MotorRental.findOne({where: { id } });
    if (!MotorRental) return next(new HttpBadRequest("Motor rental not found", 404));
    res.status(200).json({
        'status': true,
        'data': MotorRental
    })
});

module.exports = {
    getMotorRentals,
    getMotorRentalId
};