// const user = require("./user");

module.exports = (sequelize, DataTypes) => {
    const LeaveAllocation = sequelize.define("Leave Allocation", {
        employee_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        default_annual_leave:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        default_sick_leave:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        default_special_leave:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        default_unpaid_leave:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        total_annual_leave:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        total_sick_leave:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        total_special_leave:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        total_unpaid_leave:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        total_long_sick_leave:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        year_1:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        year_2:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        year_3:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },

        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        updated_by: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
    },{
        tableName: 'leave_allocations',
        timestamps: false
    });

    return LeaveAllocation
}