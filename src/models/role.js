// const user = require("./user");

module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define("Role", {
        role_name: {
            type: DataTypes.TEXT,
            unique: true,
            allowNull: false
        },
        role_type: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1
            
        },
        created_by: {
            type: DataTypes.INTEGER,
            // references: {
            //     model: user,
            //     key: 'id'
            // },
            allowNull: false
        },
        updated_by: {
            type: DataTypes.INTEGER,
            // references: {
            //     model: user,
            //     key: 'id'
            // },
            defaultValue: null
        },
    },{
        tableName: 'roles',
        timestamps: false
    });

    return Role
}