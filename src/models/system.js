// const user = require("./user");

module.exports = (sequelize, DataTypes) => {
    const System = sequelize.define('System', {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        icon: DataTypes.STRING,
        url: {
            type: DataTypes.JSON, 
            allowNull: true,
            defaultValue: [] 
        },
        color: DataTypes.STRING,
    }, {
        timestamps: false, // បិទវាចោល ប្រសិនបើក្នុង Table គ្មាន createdAt/updatedAt
        tableName: 'systems' 
    });
    return System
}