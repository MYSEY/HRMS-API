const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { USER_EXCEPTION } from "../utils/gogoStatic";
import * as bcrypt from "bcryptjs";
import JWTProvider from "../utils/jwt-provider";

const User = db.user;
const Role = db.role;
const Permission = db.permission;

const login = catchAsync(async (req, res, next) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.description = 'Endpoint to sign in a specific user,  available username => bundom, chivorn,metra with any password '
  */
    const { number_employee, password } = req.body;
    const result = await User.findOne({ where: { number_employee } });
    const resultRole = await Role.findOne({
      where: {id: result.role_id},
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
    
    if (result == null) return next(new HttpBadRequest(USER_EXCEPTION.CURREND_NAME_PASSWORD));
    
    const compare_password = await bcrypt.compare(password, result.password);

    if (!compare_password) return next(new HttpBadRequest(USER_EXCEPTION.CURREND_NAME_PASSWORD));

    let accessToken = JWTProvider.generateToken(result.id, {
      number_employee: result.number_employee,
    });

    res.status(200).json({
        accessToken,
        lifetime: JWTProvider.LifeTime,
        number_employee,
        role: resultRole
    })
});

const register = catchAsync(async (req, res, next) => {
 /*
    #swagger.tags = ['Authentication']
  */
});

module.exports = {
  login,
  register
};