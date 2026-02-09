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

db.Option = require('./option')(sequelize, DataTypes);
db.Position = require('./position')(sequelize, DataTypes);
db.Branch = require('./branch')(sequelize, DataTypes);
db.Department = require('./department')(sequelize, DataTypes);
db.ChildrenInfo = require('./children_infor')(sequelize, DataTypes);
db.ChildrenInfo.belongsTo(db.Option, { as: 'Gender', foreignKey: 'sex' });
db.Experience = require('./experience')(sequelize, DataTypes);
db.Experience.belongsTo(db.Option, { as: 'type', foreignKey: 'employment_type' });

db.Education = require('./education')(sequelize, DataTypes);
db.Education.belongsTo(db.Option, { as: 'Degree', foreignKey: 'degree' });
db.Education.belongsTo(db.Option, { as: 'FieldofStudy', foreignKey: 'field_of_study' });

db.user = require('./user')(sequelize, DataTypes);
db.user.belongsTo(db.Position, { foreignKey: 'position_id' });
db.user.belongsTo(db.Department, { foreignKey: 'department_id' });
db.user.belongsTo(db.Branch, { foreignKey: 'branch_id' });
db.user.belongsTo(db.role, { foreignKey: 'role_id' });
db.user.belongsTo(db.Option, { foreignKey: 'gender' });
db.user.belongsTo(db.Option, { as: 'MarriedStatus', foreignKey: 'marital_status' });
db.user.belongsTo(db.user, { as: 'lineManager', foreignKey: 'line_manager' });

db.system = require('./system')(sequelize, DataTypes);

db.tax = require('./tax')(sequelize, DataTypes);
db.ExchangeRate = require('./exchange_rate')(sequelize, DataTypes);
db.Bank = require('./bank')(sequelize, DataTypes);

db.MotorRental = require('./motor_rentel')(sequelize, DataTypes);
db.MotorRentalDetail = require('./motor_rental_detail')(sequelize, DataTypes);

db.LeaveRequest = require('./leave_request')(sequelize, DataTypes);
db.LeaveType = require('./leave_type')(sequelize, DataTypes);
db.DelegateLeave = require('./delegate_leave')(sequelize, DataTypes);
db.LeaveAllocation = require('./leave_allocation')(sequelize, DataTypes);
// LeaveRequest model
db.LeaveRequest.belongsTo(db.LeaveType, { foreignKey: 'leave_type_id' });
db.LeaveRequest.belongsTo(db.user, { foreignKey: 'employee_id' });
db.LeaveRequest.belongsTo(db.user, { as: 'HandoverStaff', foreignKey: 'handover_staff_id' });
db.LeaveRequest.belongsTo(db.DelegateLeave, { as: 'DelegateLeave', foreignKey: 'employee_id', targetKey: 'requester_id'});
// db.LeaveRequest.belongsTo(db.LeaveAllocation, { as: 'LeaveAllocation', foreignKey: 'employee_id', targetKey: 'employee_id'});
// LeaveType model
db.LeaveType.hasMany(db.LeaveRequest, { foreignKey: 'leave_type_id' });

db.Training = require('./training')(sequelize, DataTypes);

db.TrainingDetailStaff = require('./training_detail_staff')(sequelize, DataTypes);
db.TrainingDetailStaff.belongsTo(db.user, { foreignKey: 'employee_id' });
db.TrainingDetailStaff.belongsTo(db.Training, { foreignKey: 'training_id' });

db.TrainingDetailTrainer = require('./training_detail_trainer')(sequelize, DataTypes);

db.Training.hasMany(db.TrainingDetailStaff, {
    foreignKey: 'training_id',
    as: 'Training', // ✅ Ensure alias is correct
});

db.TrainingDetailStaff.belongsTo(db.Training, {
    foreignKey: 'training_id',
    as: 'TrainingDetailStaffAlias', // ✅ Ensure alias is the same
});

// db.Training.hasMany(db.TrainingDetailStaff, { as: 'TrainingDetailStaffAlias', foreignKey: 'training_id' });
db.Training.hasMany(db.TrainingDetailTrainer, { foreignKey: "training_id", as: "trainingDetailTrainer" });


db.Payroll = require('./payroll')(sequelize, DataTypes);
db.Payroll.belongsTo(db.user, { foreignKey: 'employee_id' });
db.PublicHoliday = require('./public_holiday')(sequelize, DataTypes);

// db.Attendance = require('./attendance')(sequelize, DataTypes);

db.sequelize.sync({force: false})
.then(() => {
    console.log('Yes re-sync done');
})

module.exports = db;