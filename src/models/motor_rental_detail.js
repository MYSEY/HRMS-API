// const user = require("./user");

module.exports = (sequelize, DataTypes) => {
    const MotorRentalDetail = sequelize.define("Motor rental detail", {
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        motor_rental_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        product_year: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        expired_year: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        shelt_life: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        motor_color: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        number_plate: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        motorcycle_brand: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        body_number: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        engine_number: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        total_gasoline: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        total_work_day: {
            type: DataTypes.DECIMAL(50,1),
            allowNull: false
        },
        price_engine_oil: {
            type: DataTypes.DECIMAL(50,2),
            allowNull: false
        },
        price_motor_rentel: {
            type: DataTypes.DECIMAL(50,2),
            allowNull: false
        },
        taplab_rentel: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        taplab_imei: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        start_date_taplab: {
            type: DataTypes.DATE,
            allowNull: false
        },
        price_taplab_rentel: {
            type: DataTypes.DECIMAL(50,2),
            allowNull: false
        },
        resigned_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        gasoline_price_per_liter: {
            type: DataTypes.DECIMAL(50,2),
            allowNull: false
        },
        amount_price_motor_rentel:{
            type: DataTypes.DECIMAL(50,2),
            allowNull: false
        },
        amount_price_engine_oil:{
            type: DataTypes.DECIMAL(50,2),
            allowNull: false
        },
        amount_price_taplab_rentel:{
            type: DataTypes.DECIMAL(50,2),
            allowNull: false
        },
        tax_rate: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        tableName: 'motor_rental_details',
        timestamps: false
    });

    return MotorRentalDetail
}