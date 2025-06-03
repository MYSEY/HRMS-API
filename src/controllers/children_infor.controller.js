const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { Math } from "core-js";
import JWTProvider from "../utils/jwt-provider";

const ChildrenInfo = db.ChildrenInfo;
const Option = db.Option;
const getChildrenInfoId = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['ChildrenInfo']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const userAuth = JWTProvider.getTokenUser(req);
    const { empleyee_id } = req.query;

    const id =  req.params.id;
    const childrenInfo = await ChildrenInfo.findAll({
        where: {
            // employee_id: userAuth.Auth.id,
            // employee_id: empleyee_id,
            employee_id: id,
            deleted_at: null,
        },
        include: [
          {
              model: Option,
              as: "Gender",
              attributes: ['name_khmer','name_english'],
              required: false,
          },
      ],
    });
    if (!childrenInfo) return next(new HttpBadRequest("ChildrenInfo not found", 404));
    res.status(200).json({
        'status': true,
        'datas': childrenInfo
    })
});
const createChildrenInfor = catchAsync(async (req, res, next) => {
    /*
      #swagger.tags = ['ChildrenInfo']
      #swagger.security = [{"bearerAuth": []}]
    */
    const userAuth = JWTProvider.getTokenUser(req);
    const { name,sex,date_of_birth } = req.body;
    const data = req.body;
      try {
        data.employee_id = userAuth.Auth.id;
        data.created_by = userAuth.Auth.id;
        await ChildrenInfo.create(data);
  
        return res.status(200).json({ message: 'Create successfully.' });
      } catch (error) {
        return res.status(500).json({ message: 'Internal server error.' });
      }
});
const updateChildrenInfor = catchAsync(async (req, res, next) => {
    /*
      #swagger.tags = ['ChildrenInfo']
      #swagger.security = [{"bearerAuth": []}]
    */
    const userAuth = JWTProvider.getTokenUser(req);
    const { id,name,sex,date_of_birth } = req.body;
      try {
        const data = await ChildrenInfo.findByPk(id);
        if (!data) {
          return res.status(404).json({ message: 'Children infor not found.' });
        }
  
        data.name = name;
        data.sex = sex;
        data.date_of_birth = date_of_birth;
        data.updated_by = userAuth.Auth.id;
        await data.save();
  
        return res.status(200).json({ message: 'Update successfully.' });
      } catch (error) {
        return res.status(500).json({ message: 'Internal server error.' });
      }
});
const deleteChildrenInfor = catchAsync(async (req, res, next) => {
  /* #swagger.tags = ['ChildrenInfo']
  * #swagger.security = [{"bearerAuth": []}]
  */
  const { id } = req.body;
  // const id =  req.params.id;
  
  try {
      await ChildrenInfo.destroy({ where: { id } });

      return res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
      // Error response
      return res.status(500).json({ message: 'Deletion failed', error: error.message });
  }
});

module.exports = {
    getChildrenInfoId,
    createChildrenInfor,
    deleteChildrenInfor,
    updateChildrenInfor,
};