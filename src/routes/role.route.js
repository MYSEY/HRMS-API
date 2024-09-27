const express = require('express');
const { validate } = require('express-validation');
const {    
    getRoles,
    getRoleById,
    roleCreate,
    updateRole,
    deleteRole 
} = require('../controllers/role.controller');
const { roleCreateRequest, roleUpdateRequest } = require('../validation/Role');

const router = express.Router();

router.get('/view', getRoles);
router.get('/view-by-id', getRoleById);
router.post('/create', validate(roleCreateRequest, {}, {}), roleCreate);
router.put('/edit', validate(roleUpdateRequest, {}, {}),updateRole);
router.delete('/delete', deleteRole);

module.exports = router;