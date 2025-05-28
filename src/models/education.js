// const option = require("./option");
module.exports = (sequelize, DataTypes) => {
    const Education = sequelize.define('Education', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: null
        },
        school: {
            type: DataTypes.STRING,
            allowNull: true
        },
        degree: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        field_of_study: {
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
        grade: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
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
        tableName: 'education',
        timestamps: false
    });

    return Education
}