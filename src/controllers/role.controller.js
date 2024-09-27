const { Math } = require('core-js');
const { Op } = require('sequelize');
const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
const { default: JWTProvider } = require('../utils/jwt-provider');
const { queryRole } = require('../utils/queryParam');

const Role = db.role;
const Permission = db.permission;

const queryRoles = async (req, res, next) => {

    const {page, page_size} = req.query;
    
    let limit = page_size ? parseInt(page_size) : 10; 
    let offset = 0;

    const where = queryRole(req);

    let query = {
        limit: limit,
        offset: offset,
        where,
        order: [['id', 'DESC']],
        include: {
            model: Permission,
            as: 'Permission',
            include: {
                model: Permission,
                as: 'Parents',
            }
        },
    };

    Role.findAndCountAll().then((data) => {
        let pages = Math.ceil(data.count / limit);
        offset = limit * ((page ? page : 0) -1);
        Role.findAll(query).then((roles) => {
        res.status(200).json({'total_data': data.count, 'pages': pages, 'datas': roles});
      });
    }).catch(function (error) {
        res.status(500).send('Internal Server Error');
    });
};

const getRoles = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Roles']
    * #swagger.security = [{"bearerAuth": []}]
    */
    let { id, search_all, status, page, page_size } = req.query;
    return await queryRoles(req, res, next);
});

const getRoleById = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Roles']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const role = await Role.findOne({ where: { id: req.query.id } });
    if (!role) return next(new HttpBadRequest("Role not found", 404));

    return await queryRoles(req, res, next);
});

const roleCreate = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Roles']
    * #swagger.security = [{"bearerAuth": []}]
    */
    if (!req.body) return next(new HttpBadRequest("No form data found", 404));

    const { role_name, description, type, permissions } = req.body;
    const roles = await Role.findOne({ where: { role_name } });

    if (roles) return next(new HttpBadRequest("Role name already exist", 404));
    const user_id = JWTProvider.getBsonSub(req);

    const dataNew = {
        role_name,
        description,
        type,
        created_by_id: user_id
    };
    const resulf = await Role.create(dataNew);
    
    await permissions.map(async (per) => {
        per["role_id"] = resulf.id;
        per["created_by_id"] = user_id;
        const perm = await Permission.create(per);
        if (per.has_sub.length > 0) {
            per.has_sub.map(acc => {
                // acc["role_id"] = resulf.id;
                acc["parent_id"] = perm.id;
                acc["created_by_id"] = user_id;
                Permission.create(acc);
            })
        }
    });

    res.status(200).json({
        status: true,
        masseage: "Created successfully",
        data: resulf,
    })
});

const updateRole = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Roles']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { role_name, description, type, old_permissions, new_permissions } = req.body;
    const { role_id } = req.query;
    const role = await Role.findOne({ where: { id: role_id } });
    if (!role) return next(new HttpBadRequest("Role not found", 404));
    const user_id = JWTProvider.getBsonSub(req);

    let d = new Date();
    let yyyy = d.getFullYear();
    let mm = d.getMonth();
    let dd = d.getDate();

    const updatedAt = `${yyyy}-${mm}-${dd}`;

    const update = {
        role_name,
        description,
        type,
        updatedAt
    }

    const dataUpdate = await Role.update(update, {
        where: {
            id: role_id
        }
    });
    
    if(new_permissions.length > 0 ){
        new_permissions.map(async (new_per) => {
            new_per["role_id"] = role_id;
            new_per["created_by_id"] = user_id;
            const perm = await Permission.create(new_per);
            if (new_per.has_sub.length > 0) {
                new_per.has_sub.map(acc => {
                    acc["parent_id"] = perm.id;
                    acc["created_by_id"] = user_id;
                    Permission.create(acc);
                })
            }
        })
    }

    await old_permissions.map(async (per) => {
        per["updatedAt"] = updatedAt;
        await Permission.update(per, { where: { id: per.id } });
    });

    res.status(200).json({
        status: true,
        message: "Updated successfully",
        data: dataUpdate,
    })
});

const deleteRole = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Roles']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { role_id } = req.query;
    const role = await Role.findOne({ where: { id: role_id } });
    if (!role) return next(new HttpBadRequest("Role not found", 404));

    const deleted = await Role.destroy({
        where: {
            id: role_id
        }
    });

    let permission_ids = [];
    const permissions = await Permission.findAll({where: {role_id},
        attributes: ['id']
    });

    await permissions.map(per => {
        permission_ids.push(per.id)
    })

    await Permission.destroy({ 
        where: {
            [Op.or]: [
                { role_id: role_id},
                { parent_id: {[Op.in]: permission_ids}}
            ]
        } 
    });

    res.status(200).json({
        status: true,
        message: "Deleted successfully",
    })
})

module.exports = {
    getRoles,
    getRoleById,
    roleCreate,
    updateRole,
    deleteRole
};