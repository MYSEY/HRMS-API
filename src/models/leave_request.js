module.exports = (sequelize, DataTypes) => {
    const LeaveRequest = sequelize.define("Leave Request", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        leave_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        request_to: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        line_manager_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        handover_staff_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        start_half_day: {
            type: DataTypes.STRING, // Adjusted to match Laravel nullable field
            allowNull: true
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end_half_day: {
            type: DataTypes.STRING, // Adjusted to match Laravel nullable field
            allowNull: true
        },
        approved_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        next_approver: {
            type: DataTypes.STRING,
            allowNull: true
        },
        approved_by: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        number_of_day: {
            type: DataTypes.STRING, // Kept as STRING to match Laravel, though INTEGER could work
            allowNull: true
        },
        total_annual_leave: {
            type: DataTypes.STRING,
            allowNull: true
        },
        total_sick_leave: {
            type: DataTypes.STRING,
            allowNull: true
        },
        total_special_leave: {
            type: DataTypes.STRING,
            allowNull: true
        },
        total_unpaid_leave: {
            type: DataTypes.STRING,
            allowNull: true
        },
        total_long_sick_leave: {
            type: DataTypes.STRING,
            allowNull: true
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: true
        },
        remark: {
            type: DataTypes.STRING,
            allowNull: true
        },
        created_by: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        updated_by: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },{
        tableName: 'leave_requests',
        timestamps: false
    });

    return LeaveRequest
}