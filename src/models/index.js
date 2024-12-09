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

db.Position = require('./position')(sequelize, DataTypes);
db.Branch = require('./branch')(sequelize, DataTypes);
db.Department = require('./department')(sequelize, DataTypes);
db.user = require('./user')(sequelize, DataTypes);
db.user.belongsTo(db.Position, { foreignKey: 'position_id' });
db.user.belongsTo(db.Department, { foreignKey: 'department_id' });
db.user.belongsTo(db.Branch, { foreignKey: 'branch_id' });

db.tax = require('./tax')(sequelize, DataTypes);
db.ExchangeRate = require('./exchange_rate')(sequelize, DataTypes);
db.Bank = require('./bank')(sequelize, DataTypes);

db.MotorRental = require('./motor_rentel')(sequelize, DataTypes);
db.MotorRentalDetail = require('./motor_rental_detail')(sequelize, DataTypes);

db.LeaveRequest = require('./leave_request')(sequelize, DataTypes);
db.LeaveType = require('./leave_type')(sequelize, DataTypes);
// LeaveRequest model
db.LeaveRequest.belongsTo(db.LeaveType, { foreignKey: 'leave_type_id' });
db.LeaveRequest.belongsTo(db.user, { foreignKey: 'employee_id' });
db.LeaveRequest.belongsTo(db.user, { as: 'HandoverStaff', foreignKey: 'handover_staff_id' });
// LeaveType model
db.LeaveType.hasMany(db.LeaveRequest, { foreignKey: 'leave_type_id' });

db.DelegateLeave = require('./delegate_leave')(sequelize, DataTypes);

db.LeaveAllocation = require('./leave_allocation')(sequelize, DataTypes);
db.Training = require('./training')(sequelize, DataTypes);
db.Payroll = require('./payroll')(sequelize, DataTypes);
db.PublicHoliday = require('./public_holiday')(sequelize, DataTypes);


db.sequelize.sync({force: false})
.then(() => {
    console.log('Yes re-sync done');
})

module.exports = db;