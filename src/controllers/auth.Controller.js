const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { USER_EXCEPTION } from "../utils/gogoStatic";
import * as bcrypt from "bcryptjs";
import JWTProvider from "../utils/jwt-provider";

const User = db.user;
const Role = db.role;
const Permission = db.permission;
const Position = db.Position;
const Department = db.Department;
const Branch = db.Branch;


const login = catchAsync(async (req, res, next) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.description = 'Endpoint to sign in a specific user,  available username => bundom, chivorn,metra with any password '
  */
  const { number_employee, password } = req.body;
  const result = await User.findOne({
    where: { number_employee },
    attributes: ["id",
      "number_employee",
      "last_name_kh",
      "first_name_kh",
      "last_name_en",
      "first_name_en",
      "employee_name_kh",
      "employee_name_en",
      "department_id",
      "position_id",
      "branch_id",
      "role_id",
      "line_manager",
      "email_verified_at",
      "email",
      "password",
      "status",
      "emp_status",
      "p_status"],
    include: [
      {
        model: Position, // Reference the associated model
        attributes: ['name_english', 'name_khmer'], // Specify fields you want from LeaveType
        required: false, // This ensures a LEFT JOIN (not INNER JOIN)
      },
      {
        model: Department,
        attributes: ['direct_manager_id', 'name_english', 'name_khmer'],
        required: false,
      },
      {
        model: Branch,
        attributes: ['direct_manager_id', 'branch_name_en', 'branch_name_kh'],
        required: false,
      },
    ],
  });

  if(result.status == "Unactive" && result.p_status == 0){
    console.log("result: ", result);
    res.status(200).json({
      lifetime: '',
      user: result,
      role: {},
      params: '', 
    })
    return false;
  }

  if (result == null) return next(new HttpBadRequest(USER_EXCEPTION.CURREND_NAME_PASSWORD));
  const resultRole = await Role.findOne({
    where: { id: result.role_id },
    include: {
      model: Permission,
      order: [['id', 'DESC']],
      as: 'Permission',
      include: {
        model: Permission,
        as: 'Parents',
      }
    },
  });
  const compare_password = await bcrypt.compare(password, result.password);

  if (!compare_password) return next(new HttpBadRequest(USER_EXCEPTION.CURREND_NAME_PASSWORD));

  let accessToken = JWTProvider.generateToken(result.id, {
    Auth: result,
    role: result.role_id,
    role_type: resultRole.role_type,
  });
  req.params.userId = result.id;
  res.status(200).json({
    accessToken,
    lifetime: JWTProvider.LifeTime,
    user: result,
    role: resultRole,
    params: req.params, 

  })
});
const logout = catchAsync(async (req, res, next) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.description = ''
  */
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout' });
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    return res.status(200).json({ message: 'Logout successful' });
  });
});

const register = catchAsync(async (req, res, next) => {
  /*
    #swagger.tags = ['Authentication']
  */
});

module.exports = {
  login,
  logout,
  register
};