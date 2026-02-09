const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { Math } from "core-js";

const System = db.system;

const getSystems = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Systems']
    * #swagger.security = [{"bearerAuth": []}]
    */
    try {
        const systems = await System.findAll({
            where: { deleted: null }, // តាម Log របស់អ្នកឃើញមាន column deleted
            order: [['id', 'DESC']]
        });
        res.json(systems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const createSystem = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Systems']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const data = req.body;
    const { 
        name,
        description,
        icon,
        url,
        color
     } = req.body;
    try {
        await System.create(data);
        return res.status(200).json({ message: 'Create successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
   
});

module.exports = {
    getSystems,
    createSystem
};