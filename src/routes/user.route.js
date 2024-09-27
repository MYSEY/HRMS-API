const express = require('express');
const { validate } = require('express-validation');
const {  
    getUser,
    getUserById,
    userCreate,
    updateUser,
    deleteUser 
} = require('../controllers/user.controller');
const { userCreateRequest, userUpdateRequest } = require('../validation/user');

const router = express.Router();

router.get('/view', getUser);
router.get('/view-by-id', getUserById);
router.post('/create',  validate(userCreateRequest, {}, { allowUnknown: false }), userCreate);
router.put('/edit', validate(userUpdateRequest, {}, { allowUnknown: false }), updateUser);
router.delete('/delete', deleteUser);

module.exports = router;