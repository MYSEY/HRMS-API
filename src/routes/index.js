import { Router } from "express";
const roleRoute = require('./role.route');
const userRoute = require('./user.route');
const authRoute = require('./auth.route')
const taxRoute = require('./tax.route')
const exchangeRateRoute = require('./exchange_rate.route')
const bankRoute = require('./bank.route')
const positionRoute = require('./position.route')
const branchRoute = require('./branch.route')
const departmentRoute = require('./department.route')
const motorRentalRoute = require('./motor_rental.route')
const motorRentalDetailRoute = require('./motor_rental_detail.route')
const leaveRequestRoute = require('./leave_request.route')

import { UnauthorizedError } from "../utils/error";
import JWTProvider from "../utils/jwt-provider";
const db = require('../models');
const User = db.user;

const verify = async (req, res, next) => {
  try {
    const token = JWTProvider.verifyToken(req);
    if (token) {
      let user = await User.findOne({ where: { id: JWTProvider.getBsonSub(req) } });
      if (!user) return next(new UnauthorizedError("Unauthorized."));
      return next();
    }
  } catch (err) {
    console.error(err);
  }

  return next(new UnauthorizedError("Bad Credential."));
};

export default ({ config, db }) => {
  let api = Router();
  // api.use('/users', userRoute);
  // api.use('/roles', roleRoute);
  api.use('/auth', authRoute);
  
  // Required with Authentication
  api.use(verify);
  api.use('/employees', userRoute);
  api.use('/leave/request', leaveRequestRoute);
  api.use('/motor/rentals', motorRentalRoute);
  api.use('/motor/rentals/details', motorRentalDetailRoute);
  api.use('/taxes', taxRoute);
  api.use('/exchange/rate', exchangeRateRoute);
  api.use('/banks', bankRoute);
  api.use('/postions', positionRoute);
  api.use('/branchs', branchRoute);
  api.use('/department', departmentRoute);
  api.use('/roles', roleRoute);

  return api;
};
