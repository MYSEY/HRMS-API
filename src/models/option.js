module.exports = (sequelize, DataTypes) => {
    const Option = sequelize.define("Option",{
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        name_khmer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name_english: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        created_by: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
        },
        updated_by: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },{
        tableName: 'options',
        timestamps: false
    });

    return Option
}
