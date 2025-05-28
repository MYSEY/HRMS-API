const express = require('express');
const { validate } = require('express-validation');
const {    
    getExperienceId,
    createExperience,
    deleteExperience,
    updateExperience,
} = require('../controllers/experience.controller');

const router = express.Router();

router.get('/view-by-id', getExperienceId);
router.post('/create', createExperience);
router.delete('/delete', deleteExperience);
router.post('/update', updateExperience);
module.exports = router;