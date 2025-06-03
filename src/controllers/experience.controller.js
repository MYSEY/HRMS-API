const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { Math } from "core-js";
import JWTProvider from "../utils/jwt-provider";

const Experience = db.Experience;
const Option = db.Option;
const getExperienceId = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Experience']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const id =  req.params.id;
    const experience = await Experience.findAll({
      where: {employee_id: id },
      include: [
          {
              model: Option,
              as: "type",
              attributes: ['name_khmer','name_english'],
              required: false,
          },
      ],
    });
    if (!experience) return next(new HttpBadRequest("Experience not found", 404));
    res.status(200).json({
        'status': true,
        'datas': experience
    })
});
const createExperience = catchAsync(async (req, res, next) => {
    /*
      #swagger.tags = ['Experience']
      #swagger.security = [{"bearerAuth": []}]
    */
    const userAuth = JWTProvider.getTokenUser(req);
    const { employment_type,
        company_name,
        position,
        start_date,
        end_date,
        location } = req.body;
    const data = req.body;
    try {
      data.employee_id = userAuth.Auth.id;
      data.created_by = userAuth.Auth.id;
      await Experience.create(data);

      return res.status(200).json({ message: 'Create successfully.' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error.' });
    }
});
const updateExperience = catchAsync(async (req, res, next) => {
  /*
    #swagger.tags = ['Experience']
    #swagger.security = [{"bearerAuth": []}]
  */
  const userAuth = JWTProvider.getTokenUser(req);
  const {
      id,
      employment_type,
      company_name,
      position,
      start_date,
      end_date,
      location } = req.body;
    try {
      const data = await Experience.findByPk(id);
      if (!data) {
        return res.status(404).json({ message: 'Experience infor not found.' });
      }

      data.employment_type  = employment_type;
      data.company_name = company_name;
      data.position = position;
      data.start_date = start_date;
      data.end_date = end_date;   
      data.location = location;      
      data.updated_by = userAuth.Auth.id;
      await data.save();

      return res.status(200).json({ message: 'Update successfully.' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error.' });
    }
});
const deleteExperience = catchAsync(async (req, res, next) => {
  /* #swagger.tags = ['Experience']
  * #swagger.security = [{"bearerAuth": []}]
  */
  const { id } = req.body;
  // const id =  req.params.id;
  
  try {
      await Experience.destroy({ where: { id } });

      return res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
      // Error response
      return res.status(500).json({ message: 'Deletion failed', error: error.message });
  }
});

module.exports = {
    getExperienceId,
    createExperience,
    deleteExperience,
    updateExperience
};