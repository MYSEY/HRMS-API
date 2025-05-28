module.exports = (sequelize, DataTypes) => {
    const ChildrenInfo = sequelize.define('ChildrenInfo', {
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
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        sex: {
            type: DataTypes.STRING,
            allowNull: true
        },
        date_of_birth: {
            type: DataTypes.DATE,
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
        tableName: 'children_infors',
        timestamps: false
    });
    

    return ChildrenInfo
}