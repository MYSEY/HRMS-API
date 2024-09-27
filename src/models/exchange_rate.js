// const user = require("./user");

module.exports = (sequelize, DataTypes) => {
    const Exchange_rate = sequelize.define("ExchangeRate", {
        amount_usd: {
            type: DataTypes.DECIMAL(50,2),
            allowNull: false
        },
        amount_riel: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        change_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        type: {
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
        tableName: 'exchange_rates',
        timestamps: false
    });

    return Exchange_rate
}