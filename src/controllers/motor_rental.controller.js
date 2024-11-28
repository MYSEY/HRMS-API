const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { Math } from "core-js";
import JWTProvider from "../utils/jwt-provider";

const MotorRental = db.MotorRental;
const MotorRentalDetail = db.MotorRentalDetail;

const getMotorRentalId = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Motor rentals']
    * #swagger.security = [{"bearerAuth": []}]
    */
    let { id } = req.query;
    const userAuth = JWTProvider.getTokenUser(req);
    const motorRental = await MotorRental.findOne({where: { employee_id: userAuth.Auth.id },order: [['id', 'DESC']], });
    const motorRentalDetail = await MotorRentalDetail.findOne({where: { employee_id: userAuth.Auth.id},order: [['id', 'DESC']], });
    if (!motorRental) return next(new HttpBadRequest("Motor rental not found", 404));
    res.status(200).json({
        'status': true,
        'datas': motorRental,
        'detail': motorRentalDetail
    })
});

module.exports = {
    getMotorRentalId
};