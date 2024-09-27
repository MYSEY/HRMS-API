const express = require('express');
const { validate } = require('express-validation');
const {    
    getPositions,
    getPositionId,
} = require('../controllers/position.controller');
// const { roleCreateRequest, roleUpdateRequest } = require('../validation/Role');

const router = express.Router();

router.get('/view', getPositions);
router.get('/view-by-id', getPositionId);
module.exports = router;