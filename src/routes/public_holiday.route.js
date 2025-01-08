const express = require('express');
const { validate } = require('express-validation');
const {    
    getPublicHolidays,
    getPublicHolidayId,
    searchHolidays,
} = require('../controllers/public_holiday.controller');
// const { roleCreateRequest, roleUpdateRequest } = require('../validation/Role');

const router = express.Router();

router.get('/view', getPublicHolidays);
router.get('/view-by-id', getPublicHolidayId);
router.get('/search', searchHolidays);
module.exports = router;