// const user = require("./user");

module.exports = (sequelize, DataTypes) => {
    const Branch = sequelize.define("Branch", {
        no:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        branch_name_kh: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        branch_name_en: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        direct_manager_id: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        abbreviations: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        address_kh: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
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
        tableName: 'branchs',
        timestamps: false
    });

    return Branch
}