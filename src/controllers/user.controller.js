const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import * as bcrypt from "bcryptjs";
import { Math } from "core-js";
import JWTProvider from "../utils/jwt-provider";

const User = db.user;
const Position = db.Position;

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
        const users = await User.findAll({
            limit: limit,
            offset: offset,
            // attributes: ['id', 'number_employee', 'last_name_kh'],
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
    let { id } = req.query;
    const user = await User.findOne({  
        attributes: {exclude: ['password', 'token']},
        where: { id },
        include: [
            {
                model: Position, // Reference the associated model
                attributes: ['name_english', 'name_khmer'], // Specify fields you want from LeaveType
                required: false, // This ensures a LEFT JOIN (not INNER JOIN)
            },
        ],
    });
    if (!user) return next(new HttpBadRequest("User not found", 404));
    res.status(200).json({
        'status': true,
        'data': user
    })
});

const userCreate = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Employees']
    * #swagger.security = [{"bearerAuth": []}]
    */
    if (!req.body) return next(new HttpBadRequest("No form data found", 404));

    const { username, email, password, role_id } = req.body;
    const hash_password = await bcrypt.hash(password, 10);

    const info = {
        username,
        email,
        role_id,
        password: hash_password
    };
    const resulf = await User.create(info);

    let accessToken = JWTProvider.generateToken(resulf.id, {
        username: resulf.username,
    });

    const dataUpdate = await User.update({token: accessToken}, {
        where: {
            id: resulf.id
        }
    });

    res.status(200).json({
        status: true,
        masseage: "Created successfully",
        data: resulf,
    })
});

const updateUser = catchAsync(async (req, res, next) => {

    /* #swagger.tags = ['Employees']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { username, email, role_id } = req.body;
    const { id } = req.query;
    const user = await User.findOne({ where: { id } });
    if (!user) return next(new HttpBadRequest("User not found", 404));

    let d = new Date();
    let yyyy = d.getFullYear();
    let mm = d.getMonth();
    let dd = d.getDate();

    const updatedAt = `${yyyy}-${mm}-${dd}`;

    const update = {
        username,
        email,
        role_id,
        updatedAt
    }

    const dataUpdate = await User.update(update, {
        where: {
            id
        }
    });

    res.status(200).json({
        status: true,
        message: "Updated successfully",
        data: dataUpdate,
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

const deleteUser = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Employees']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { id } = req.query;
    const user = await User.findOne({ where: { id } });
    if (!user) return next(new HttpBadRequest("User not found", 404));

    const deleted = await User.destroy({
        where: {
            id
        }
    });

    res.status(200).json({
        status: true,
        message: "Deleted successfully",
    })
})

module.exports = {
    getUser,
    getUserById,
    userCreate,
    updateUser,
    changePassword,
    deleteUser
};