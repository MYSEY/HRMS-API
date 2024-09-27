// const role = require("./role");
const db = require('../models')
// const user = require("./user");

const Role = db.role;

module.exports = (sequelize, DataTypes) => {
    const Permission = sequelize.define("Permission", {
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        menu_id: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        sub_menu_id: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        icon: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        parent_id: {
            type: DataTypes.INTEGER,
            // references: {
            //     model: role,
            //     key: 'id'
            // },
            // allowNull: false
        },
        role_id: {
            type: DataTypes.INTEGER,
            // references: {
            //     model: Role,
            //     key: 'role_id'
            // },
            // allowNull: false
        },
        is_all:{
             type: DataTypes.INTEGER
        },
        is_active:{
             type: DataTypes.INTEGER
        },
        is_create:{
             type: DataTypes.INTEGER
        },
        is_view:{
             type: DataTypes.INTEGER
        },
        is_view_salary:{
             type: DataTypes.INTEGER
        },
        is_update:{
             type: DataTypes.INTEGER
        },
        is_delete:{
             type: DataTypes.INTEGER
        },
        is_cancel:{
             type: DataTypes.INTEGER
        },
        is_accept:{
             type: DataTypes.INTEGER
        },
        is_approve:{
             type: DataTypes.INTEGER
        },
        is_reject:{
             type: DataTypes.INTEGER
        },
        is_print:{
             type: DataTypes.INTEGER
        },
        is_import:{
             type: DataTypes.INTEGER
        },
        is_export:{
             type: DataTypes.INTEGER
        },
        is_access:{
             type: DataTypes.INTEGER
        },
        is_view_report:{
             type: DataTypes.INTEGER
        },
        is_operation:{
             type: DataTypes.INTEGER
        },
        created_by:{
             type: DataTypes.INTEGER
        },
        updated_by:{
             type: DataTypes.INTEGER
        },
    },{
        tableName: 'permissions',
        timestamps: false
    }); 

    // Permission.hasOne(Role, {as: 'Role', foreignKey: 'role_id'});

    return Permission
}