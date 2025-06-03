const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { Math } from "core-js";
import JWTProvider from "../utils/jwt-provider";

const Education = db.Education;
const Option = db.Option;
const getEducationId = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Education']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const id =  req.params.id;
    const education = await Education.findAll({
        where: {employee_id: id },
        include: [
            {
                model: Option,
                as: "Degree",
                attributes: ['name_khmer','name_english'],
                required: false,
            },
            {
                model: Option,
                as: "FieldofStudy",
                attributes: ['name_khmer','name_english'],
                required: false,
            },
        ],
    });
    if (!education) return next(new HttpBadRequest("Education not found", 404));
    res.status(200).json({
        'status': true,
        'datas': education
    })
});
const createEducation = catchAsync(async (req, res, next) => {
    /*
      #swagger.tags = ['Education']
      #swagger.security = [{"bearerAuth": []}]
    */
    const userAuth = JWTProvider.getTokenUser(req);
    const { school,
        degree,
        field_of_study,
        start_date,
        end_date,
        grade,
        description } = req.body;
    const data = req.body;
      try {
        data.employee_id = 8;
        data.created_by = userAuth.Auth.id;
        await Education.create(data);
  
        return res.status(200).json({ message: 'Create successfully.' });
      } catch (error) {
        return res.status(500).json({ message: 'Internal server error.' });
      }
});
const updateEducation = catchAsync(async (req, res, next) => {
    /*
      #swagger.tags = ['Education']
      #swagger.security = [{"bearerAuth": []}]
    */
    const userAuth = JWTProvider.getTokenUser(req);
    const { 
        id,
        school,
        degree,
        field_of_study,
        start_date,
        end_date,
        grade,
        description } = req.body;
      try {
        const data = await Education.findByPk(id);
        if (!data) {
          return res.status(404).json({ message: 'Education infor not found.' });
        }
  
        data.school = school;
        data.degree = degree;
        data.field_of_study = field_of_study;
        data.start_date = start_date;
        data.end_date = end_date;
        data.grade = grade;
        data.description = description;
        data.updated_by = userAuth.Auth.id;
        await data.save();
  
        return res.status(200).json({ message: 'Update successfully.' });
      } catch (error) {
        return res.status(500).json({ message: 'Internal server error.' });
      }
});
const deleteEducation = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Education']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { id } = req.body;
    // const id =  req.params.id;
    
    try {
        await Education.destroy({ where: { id } });
  
        return res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        // Error response
        return res.status(500).json({ message: 'Deletion failed', error: error.message });
    }
});


module.exports = {
    getEducationId,
    createEducation,
    deleteEducation,
    updateEducation,
};