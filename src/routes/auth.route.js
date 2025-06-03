const express = require('express');
const { validate } = require('express-validation');
const { login, updatePassword, logout, register } = require('../controllers/auth.Controller');
const { loginInRequest } = require('../validation/user');

const router = express.Router(); 
router.post('/login', validate(loginInRequest, {}, {}), login);
router.post('/confirm', updatePassword);
router.post('/logout', logout);
router.post('/register', register);

module.exports = router;