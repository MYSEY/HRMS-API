// const user = require("./user");

module.exports = (sequelize, DataTypes) => {
    const Position = sequelize.define("Position", {
        name_khmer: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        name_english: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        position_type: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        position_type_number: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        position_range: {
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
        tableName: 'positions',
        timestamps: false
    });

    return Position
}