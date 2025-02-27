const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { Math } from "core-js";
import JWTProvider from "../utils/jwt-provider";
const { Op, fn, col, literal } = require('sequelize');

const User = db.user;
const TrainingDetailStaff = db.TrainingDetailStaff;
const TrainingDetailTrainer = db.TrainingDetailTrainer;
const Training = db.Training;

const getTrainings = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Trainings']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { page = 1, page_size = 10 } = req.query;

    let limit = parseInt(page_size);
    let offset = (page - 1) * limit;
    const userAuth = JWTProvider.getTokenUser(req);
    
    try {
        const TrainingDetailStaffs = await TrainingDetailStaff.findAll({
            where: { employee_id: userAuth.Auth.id, deleted_at:null },
            include: [
                {
                    model: User,
                    attributes: ['number_employee', 'employee_name_kh', 'employee_name_en', 'date_of_commencement'],
                    required: false,
                },
                {
                    model: Training,
                    as:"Training",
                    where: { deleted_at:null },
                    include: [
                        {
                            model: TrainingDetailStaff,
                            as: 'Training',
                            required: false,
                            where: {
                                training_id: { [Op.ne]: null },
                                deleted_at:null
                            },
                            
                        },
                    ],
                    attributes: {
                        include: [
                            [fn('COUNT', col('Training.id')), 'alias_count']
                        ],
                        exclude: ['employee_id', 'trainer_id'],
                    },
                    required: false,
                },
            ],
            group: ['id'],
            order: [['id', 'DESC']],
        });
        res.status(200).json({
            datas: TrainingDetailStaffs,
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