const express = require('express');
const { validate } = require('express-validation');
const {    
    getSystems,
    createSystem,
} = require('../controllers/system_create.controller');

const router = express.Router();

router.get('/view', getSystems);
router.post('/create', createSystem);

module.exports = router;