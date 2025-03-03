const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import * as bcrypt from "bcryptjs";
import { Math } from "core-js";
import JWTProvider from "../utils/jwt-provider";
const { Op } = require('sequelize');

const User = db.user;
const Position = db.Position;
const role = db.role;
const Branch = db.Branch;
const Department = db.Department;
const Option = db.Option;

const getUser = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Employees']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { page = 1, page_size = 10 } = req.query;

    let limit = parseInt(page_size);
    let offset = (page - 1) * limit;
    
    try {
        // Count the total number of users
        const data = await User.findAndCountAll();

        // Calculate total pages
        let pages = Math.ceil(data.count / limit);

        // Fetch users with pagination
        let excludeSet = [
            'password', 'pre_salary', 'basic_salary', 'salary_increas'
        ];
        const users = await User.findAll({
            where: {
                emp_status: { [Op.in]: ['Probation', '1', '2', '10'] },
                deleted_at: null,
            },
            attributes: {
                exclude: excludeSet
            },
            include: [
                {
                    model: Option,
                    attributes: ['name_khmer','name_english'],
                    required: false,
                },
                {
                    model: role,
                    attributes: ['role_name','role_type'],
                    required: false,
                },
                {
                    model: Branch,
                    attributes: ['branch_name_kh','branch_name_en','direct_manager_id'],
                    required: false,
                },
                {
                    model: Department,
                    attributes: ['direct_manager_id','name_khmer','name_english'],
                    required: false,
                },
                {
                    model: Position,
                    attributes: ['name_khmer','name_english'],
                    required: false,
                },
            ],
            // limit: limit,
            // offset: offset,
            order: [['id', 'DESC']],
        });

        // Respond with data
        res.status(200).json({
            datas: users,
            count: data.count,
            pages: pages,
            current_page: page
        });

    } catch (error) {
        console.error('Error:', error.message); // Log detailed error
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

const getUserById = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Employees']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const id =  req.params.id;
    console.log("Employee ID: ", id);
    let excludeSet = [
        'password', 'pre_salary', 'basic_salary', 'salary_increas'
    ];
    const user = await User.findOne({
        where: {
            id: id,
            deleted_at: null,
        },
        attributes: {
            exclude: excludeSet
        },
        include: [
            {
                model: Option,
                attributes: ['name_khmer','name_english'],
                required: false,
            },
            {
                model: role,
                attributes: ['role_name','role_type'],
                required: false,
            },
            {
                model: Branch,
                attributes: ['branch_name_kh','branch_name_en','direct_manager_id'],
                required: false,
            },
            {
                model: Department,
                attributes: ['direct_manager_id','name_khmer','name_english'],
                required: false,
            },
            {
                model: Position,
                attributes: ['name_khmer','name_english'],
                required: false,
            },
        ],
    });
    if (!user) return next(new HttpBadRequest("User not found", 404));
    res.status(200).json({
        'status': true,
        'data': user
    })
});


const changePassword = catchAsync(async (req, res, next) => {
    /*
      #swagger.tags = ['Employees']
      #swagger.security = [{"bearerAuth": []}]
    */
  
    // Change password function
    const userAuth = JWTProvider.getTokenUser(req);
    const { newPassword, confirmPassword } = req.body;
      try {
        // Validate passwords
        if (!newPassword || !confirmPassword) {
          return res.status(400).json({ message: 'Passwords are required.' });
        }
        if (newPassword !== confirmPassword) {
          return res.status(400).json({ message: 'Passwords do not match.' });
        }
  
        // Hash the new password
        const saltRounds = 8;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
        // Update password in the database
        const user = await User.findByPk(userAuth.Auth.id); // Adjust for your ORM/query
        if (!user) {
          return res.status(404).json({ message: 'User not found.' });
        }
  
        user.password = hashedPassword; // Assuming the password field is named `password`
        await user.save();
  
        return res.status(200).json({ message: 'Password updated successfully.' });
      } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ message: 'Internal server error.' });
      }
});

module.exports = {
    getUser,
    getUserById,
    changePassword
};