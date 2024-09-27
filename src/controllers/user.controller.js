const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import * as bcrypt from "bcryptjs";
import { Math } from "core-js";
import JWTProvider from "../utils/jwt-provider";

const User = db.user;

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
    const user = await User.findOne({  attributes: {exclude: ['password', 'token']},where: { id } });
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
    deleteUser
};