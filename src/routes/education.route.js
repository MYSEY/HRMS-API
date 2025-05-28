const express = require('express');
const { validate } = require('express-validation');
const {    
    getEducationId,
    createEducation,
    deleteEducation,
    updateEducation,
} = require('../controllers/education.controller');

const router = express.Router();

router.get('/view-by-id', getEducationId);
router.post('/create', createEducation);
router.delete('/delete', deleteEducation);
router.post('/update', updateEducation);
module.exports = router;