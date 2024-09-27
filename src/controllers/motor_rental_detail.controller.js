const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { Math } from "core-js";

const MotorRentalDetail = db.MotorRentalDetail;

const getMotorRentalDetails = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Motor rental details']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { page = 1, page_size = 10 } = req.query;

    let limit = parseInt(page_size);
    let offset = (page - 1) * limit;
    
    try {
        // Count the total number of Motor rental details
        const data = await MotorRentalDetail.findAndCountAll();

        // Calculate total pages
        let pages = Math.ceil(data.count / limit);

        const MotorRentalDetails = await MotorRentalDetail.findAll({
            limit: limit,
            offset: offset,
            // attributes: [],
            order: [['id', 'DESC']],
        });

        // Respond with data
        res.status(200).json({
            datas: MotorRentalDetails,
            count: data.count,
            pages: pages,
            current_page: page
        });

    } catch (error) {
        console.error('Error:', error.message); // Log detailed error
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
const getMotorRentalDetailId = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Motor rental details']
    * #swagger.security = [{"bearerAuth": []}]
    */
    let { id } = req.query;
    const MotorRentalDetail = await MotorRentalDetail.findOne({where: { id } });
    if (!MotorRentalDetail) return next(new HttpBadRequest("Motor rental detail not found", 404));
    res.status(200).json({
        'status': true,
        'data': MotorRentalDetail
    })
});

module.exports = {
    getMotorRentalDetails,
    getMotorRentalDetailId
};