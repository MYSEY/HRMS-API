const express = require('express');
const { validate } = require('express-validation');
const {    
    getChildrenInfoId,
    createChildrenInfor,
    deleteChildrenInfor,
    updateChildrenInfor,
} = require('../controllers/children_infor.controller');

const router = express.Router();

router.get('/view-by-id/:id', getChildrenInfoId);
router.post('/create', createChildrenInfor);
router.delete('/delete', deleteChildrenInfor);
router.post('/update', updateChildrenInfor);
module.exports = router;