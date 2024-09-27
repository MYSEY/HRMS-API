// const user = require("./user");

module.exports = (sequelize, DataTypes) => {
    const Tax = sequelize.define("Tax", {
        tax_rate: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        from: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        to: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tax_deduction_amount: {
            type: DataTypes.INTEGER,
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
        tableName: 'taxes',
        timestamps: false
    });

    return Tax
}