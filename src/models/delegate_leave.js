module.exports = (sequelize, DataTypes) => {
    const DelegateLeave = sequelize.define("DelegateLeaves", {
        requester_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        delegate_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        number_of_day:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        start_date:{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: null
        },
        end_date:{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: null
        },
    },{
        tableName: 'delegate_leaves',
        timestamps: false
    });

    return DelegateLeave
}