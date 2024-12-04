const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { Math } from "core-js";
import JWTProvider from "../utils/jwt-provider";
const { Op } = require('sequelize');

const Training = db.Training;

const getTrainings = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Trainings']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { page = 1, page_size = 10 } = req.query;

    // let limit = parseInt(page_size);
    // let offset = (page - 1) * limit;
    const user = JWTProvider.getTokenUser(req);
    
    try {
        // Count the total number of Training
        const data = await Training.findAndCountAll();

        // Calculate total pages
        // let pages = Math.ceil(data.count / limit);
        console.log("user id: ",user.Auth.id);
        const trainings = await Training.findAll({
            "employee_id": {
                // [Op.contains]: [user.Auth.id]
                [Op.contains]: ["164"]
            },
            // attributes: [],
            order: [['id', 'DESC']],
        });

        // Respond with data
        res.status(200).json({
            datas: trainings,
            count: data.count,
        });

    } catch (error) {
        console.error('Error:', error.message); // Log detailed error
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
const getTrainingId = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Trainings']
    * #swagger.security = [{"bearerAuth": []}]
    */
    let { id } = req.query;
    const training = await Training.findOne({where: { id } });
    if (!training) return next(new HttpBadRequest("Training not found", 404));
    res.status(200).json({
        'status': true,
        'data': training
    })
});

module.exports = {
    getTrainings,
    getTrainingId
};