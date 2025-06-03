// const user = require("./user");

module.exports = (sequelize, DataTypes) => {
    const Experience = sequelize.define('Experience', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: null
            // references: {
            //     model: Employee,
            //     key: 'id'
            // }
        },
        employment_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        position: {
            type: DataTypes.STRING,
            allowNull: true
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        location: {
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
        }
    }, {
        tableName: 'experiences',
        timestamps: false
    });

    return Experience
}