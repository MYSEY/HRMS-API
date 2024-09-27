// const user = require("./user");

module.exports = (sequelize, DataTypes) => {
    const Department = sequelize.define("Department", {
        direct_manager_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name_khmer:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        name_english:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        parent_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        head_department:{
            type: DataTypes.INTEGER,
            allowNull: false,
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
        tableName: 'departments',
        timestamps: false
    });

    return Department
}