const express = require('express');
const { validate } = require('express-validation');
const {    
    getTaxes,
    getTaxId,
} = require('../controllers/tax.controller');
// const { roleCreateRequest, roleUpdateRequest } = require('../validation/Role');

const router = express.Router();

router.get('/view', getTaxes);
router.get('/view-by-id', getTaxId);
// router.post('/create', validate(roleCreateRequest, {}, {}), roleCreate);
// router.put('/edit', validate(roleUpdateRequest, {}, {}),updateRole);
// router.delete('/delete', deleteRole);

module.exports = router;