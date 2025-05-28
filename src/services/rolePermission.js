const db = require('../models');
const Permission = db.permission
const getPermission = async (role_id, url) => {
    try {
        const permission = await Permission.findOne({
            where: {
                role_id: role_id,
                url: url,
                deleted_at: null,
            },
        });

        return permission;
    } catch (error) {
        console.error('Error fetching permission:', error);
        throw error;
    }
};

module.exports = { getPermission };