// const user = require("./user");

module.exports = (sequelize, DataTypes) => {
    const LeaveRequest = sequelize.define("Leave Request", {

        employee_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        leave_type_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        request_to:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        line_manager_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        handover_staff_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        start_date:{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: null
        },
        start_half_day:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        end_date:{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: null
        },
        end_half_day:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        approved_date:{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: null
        },
        next_approver:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        approved_by:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        status:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        number_of_day:{
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
        reason:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        remark:{
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
        tableName: 'leave_requests',
        timestamps: false
    });

    return LeaveRequest
}