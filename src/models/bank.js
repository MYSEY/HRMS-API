// const user = require("./user");

module.exports = (sequelize, DataTypes) => {
    const Bank = sequelize.define("Bank", {
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        fee: {
            type: DataTypes.DECIMAL(50,2),
            allowNull: false
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
        tableName: 'banks',
        timestamps: false
    });

    return Bank
}