const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { Math } from "core-js";
import JWTProvider from "../utils/jwt-provider";

const MotorRentalDetail = db.MotorRentalDetail;

const getMotorRentalDetailId = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Motor rental details']
    * #swagger.security = [{"bearerAuth": []}]
    */

    let { id } = req.query;
    const userAuth = JWTProvider.getTokenUser(req);
    const motorRentalDetail = await MotorRentalDetail.findAll({where: { employee_id: userAuth.Auth.id} });
    res.status(200).json({
        'status': true,
        'datas': motorRentalDetail
    })
});

module.exports = {
    getMotorRentalDetailId
};