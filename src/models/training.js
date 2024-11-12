// const user = require("./user");

module.exports = (sequelize, DataTypes) => {
    const Training = sequelize.define("Training", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        training_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        course_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trainer_id: {
            type: DataTypes.JSON, // use DataTypes.INTEGER if a single integer ID is expected
            allowNull: false,
        },
        employee_id: {
            type: DataTypes.JSON, // use DataTypes.INTEGER if a single integer ID is expected
            allowNull: false,
        },
        cost_price: {
            type: DataTypes.DECIMAL,
            defaultValue: 0,
            allowNull: true,
        },
        discount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: true,
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        duration_month: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        remark: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        created_by: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        updated_by: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    }, {
        tableName: 'trainings',
        timestamps: false
    });

    return Training
}