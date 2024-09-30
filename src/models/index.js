const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB,
    process.env.USER,
    process.env.PASSWORD, 
    {
        host: process.env.HOST,
        dialect: process.env.DIALECT,
        operatorAliases: false,
        pool: {
            max: process.env.POOL.max,
            min: process.env.POOL.min,
            acquire: process.env.POOL.acquire,
            idle: process.env.POOL.idle
        }
    }
)

sequelize.authenticate().then(err => {
    console.log('connected..');
}).catch(err => {
    console.log('Error' + err);
})

const db ={}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.role = require('./role')(sequelize, DataTypes);

db.permission = require('./permission')(sequelize, DataTypes);
db.permission.hasMany(db.permission, {as: 'Parents', foreignKey: 'parent_id'})
db.role.hasMany(db.permission, {as: 'Permission', foreignKey: 'role_id'})
db.user = require('./user')(sequelize, DataTypes);

db.tax = require('./tax')(sequelize, DataTypes);
db.ExchangeRate = require('./exchange_rate')(sequelize, DataTypes);
db.Bank = require('./bank')(sequelize, DataTypes);
db.Position = require('./position')(sequelize, DataTypes);
db.Branch = require('./branch')(sequelize, DataTypes);
db.Department = require('./department')(sequelize, DataTypes);
db.MotorRental = require('./motor_rentel')(sequelize, DataTypes);
db.MotorRentalDetail = require('./motor_rental_detail')(sequelize, DataTypes);
db.LeaveRequest = require('./leave_request')(sequelize, DataTypes);


db.sequelize.sync({force: false})
.then(() => {
    console.log('Yes re-sync done');
})

module.exports = db;