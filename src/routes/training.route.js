const express = require('express');
const { validate } = require('express-validation');
const {    
    getTrainings,
    getTrainingId,
} = require('../controllers/training.controller');
// const { roleCreateRequest, roleUpdateRequest } = require('../validation/Role');

const router = express.Router();

router.get('/view', getTrainings);
router.get('/view-by-id', getTrainingId);

module.exports = router;