const express = require('express');
const { validate } = require('express-validation');
const {  
    getUser,
    getUserById,
    changePassword,
} = require('../controllers/user.controller');
// const { userCreateRequest, userUpdateRequest } = require('../validation/user');

const router = express.Router();

router.get('/view', getUser);
router.get('/view-by-id/:id', getUserById);
router.post('/change/password', changePassword);

module.exports = router;