// const user = require("./user");

module.exports = (sequelize, DataTypes) => {
    const LeaveType = sequelize.define("leaveType", {
        name:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        description:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        type:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        default_day:{
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
        tableName: 'leave_types',
        timestamps: false
    });

    return LeaveType
}