module.exports = (sequelize, DataTypes) => {
    const PublicHoliday = sequelize.define('PublicHoliday', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        title_kh: {
            type: DataTypes.STRING,
            allowNull: false, // Adjust if the field can be nullable
        },
        title_en: {
            type: DataTypes.STRING,
            allowNull: false, // Adjust if the field can be nullable
        },
        amount_percent: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        period_month: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        from: {
            type: DataTypes.DATEONLY,
            allowNull: false, // Make sure it's not nullable
        },
        to: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        type: {
            type: DataTypes.STRING,
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
        },
    }, {
        timestamps: false, // Adds `createdAt` and `updatedAt` fields
        paranoid: true, // Adds `deletedAt` field for soft deletes
        tableName: 'holidays', // Optional: Specify the table name
    });
    return PublicHoliday
}
