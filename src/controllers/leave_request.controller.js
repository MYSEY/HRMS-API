const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { Math } from "core-js";
import moment from "moment";
import { sequelize } from "../models";
import JWTProvider from "../utils/jwt-provider";
const { Op } = require('sequelize');
const { parse, isWeekend, eachDayOfInterval } = require('date-fns');

const LeaveRequest = db.LeaveRequest;
const LeaveAllocation = db.LeaveAllocation;
const LeaveType = db.LeaveType;
const DelegateLeave = db.DelegateLeave;
const Branch = db.Branch;
const Department = db.Department;
const User = db.user;

const getLeaveRequests = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Leave Requests']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { page = 1, page_size = 10 } = req.query;

    let limit = parseInt(page_size);
    let offset = (page - 1) * limit;
    const userAuth = JWTProvider.getTokenUser(req);
    
    try {
        // Count the total number of Motor rentals
        const data = await LeaveRequest.findAndCountAll({where:{ employee_id: userAuth.Auth.id}});

        // Calculate total pages
        let pages = Math.ceil(data.count / limit);
        const Leave_allocation = await LeaveAllocation.findOne({where:{ employee_id: userAuth.Auth.id}});

        const LeaveRequests = await LeaveRequest.findAll({
            where: {
                employee_id: userAuth.Auth.id,
                deleted_at: null,
            },
            order: [['id', 'DESC']],
            include: [
                {
                    model: LeaveType,
                    attributes: ['name'],
                    required: false,
                },
                {
                    model: DelegateLeave,
                    as: 'DelegateLeave',
                    required: false,
                    where: sequelize.literal(`
                        \`DelegateLeave\`.\`start_date\` = \`LeaveRequest\`.\`start_date\` AND
                        \`DelegateLeave\`.\`end_date\` = \`LeaveRequest\`.\`end_date\`
                    `),
                },
            ],
            distinct: true,
        });

        // Respond with data
        res.status(200).json({
            datas: LeaveRequests,
            LeaveAllocation: Leave_allocation,
            count: data.count,
            pages: pages,
            current_page: page
        });

    } catch (error) {
        console.error('Error:', error.message); // Log detailed error
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
const getLeaveApproves = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Leave Requests']
    * #swagger.security = [{"bearerAuth": []}]
    */
    let { id } = req.query;
    const userAuth = JWTProvider.getTokenUser(req);
    const leaveRequests = await LeaveRequest.findAll({ 
        where: {
            next_approver: userAuth.Auth.id,
            deleted_at: null,
            status: {
                [Op.in]: ["approved_lm", "pending"]
            }
        },
        order: [['id', 'DESC']],
        include: [
            {
                model: LeaveType,
                attributes: ['name'],
                required: false,
            },
            {
                model: User,
                attributes: ['employee_name_kh','employee_name_en'],
                required: false,
            },
            {
                model: User,
                as: 'HandoverStaff',
                attributes: ['employee_name_kh', 'employee_name_en'],
                required: false,
            },
            {
                model: DelegateLeave,
                as: 'DelegateLeave',
                required: false,
                where: {
                    start_date: sequelize.col('Leave Request.start_date'),
                    end_date: sequelize.col('Leave Request.end_date'),
                },
            },
        ],
    });
    res.status(200).json({
        'status': 200,
        'datas': leaveRequests
    })
});

const getEmployees = catchAsync(async (req, res, next) =>{
    /* #swagger.tags = ['Leave Requests']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const userAuth = JWTProvider.getTokenUser(req);
    let employees = [];
    let delegateEmployees = [];

    // Define a base filter for excluding the current user
    let filter = {
        where: {
            id: { [Op.ne]: userAuth.Auth.id }
        },
        attributes: { exclude: ['password'] }
    };

    // Determine additional filters based on userAuth.role_type
    if (userAuth.role_type === 'BM') {
        // Branch Manager
        filter.where.branch_id = userAuth.Auth.branch_id;
    } else if (userAuth.role_type === 'HOD') {
        // Head of Department
        filter.where.department_id = userAuth.Auth.department_id;
    } else if (userAuth.role_type === 'Employee') {
        // Regular Employee with complex conditions
        filter.where = {
            ...filter.where,
            [Op.or]: [
                { id: userAuth.Auth.line_manager },
                { line_manager: userAuth.Auth.line_manager }
            ],
            department_id: userAuth.Auth.department_id,
            branch_id: userAuth.Auth.branch_id
        };
    } else if (['HR', 'HRAdmin'].includes(userAuth.role_type)) {
        // HR or HR Admin
        filter.where.department_id = userAuth.Auth.department_id;
    }

    // Execute the query
    employees = await User.findAll(filter);

    // Set up role-based filtering for delegateEmployees
    const roleFilter = {
        where: {
            id: { [Op.ne]: userAuth.Auth.id }      // Exclude the current user
        },
        attributes: { exclude: ['password'] }
    };

    // Apply filters based on role
    if (userAuth.role_type === 'BM') {
        roleFilter.where.branch_id = userAuth.Auth.branch_id;
    } else if (userAuth.role_type === 'HOD') {
        roleFilter.where.department_id = userAuth.Auth.department_id;
    } else if (['HR', 'HRAdmin'].includes(userAuth.role_type)) {
        roleFilter.where.department_id = userAuth.Auth.department_id;
    }

    // Query for delegateEmployees without join
    delegateEmployees = await User.findAll(roleFilter);

    const LeaveTypes = await LeaveType.findAll();
    res.status(200).json({
        datas: employees,
        delegates: delegateEmployees,
        leaveTypes: LeaveTypes,
    });
});

async function duplicateLeave(requestData, employeeId) { 
    const startDate = requestData.start_date + " 00:00";
    const endDate = requestData.end_date + " 23:59";
    const startHalfDay = requestData.start_half_day;
    const endHalfDay = requestData.end_half_day;

    // Check for overlapping leave requests
    let overlappingLeave = await LeaveRequest.findOne({
        where: {
            employee_id: employeeId,
            deleted_at: null,
            status: {
                [Op.in]: ["approved_lm","approved_hod", "pending"]
            },
            [Op.or]: [
                {
                    start_date: {
                        [Op.lt]: endDate,
                    },
                    end_date: {
                        [Op.gt]: startDate,
                    },
                },
                {
                    start_date: startDate,
                    end_date: endDate,
                    [Op.and]: [
                        {
                            [Op.or]: [
                                {
                                    start_half_day: startHalfDay,
                                    end_half_day: false,
                                },
                                {
                                    start_half_day: false,
                                    end_half_day: endHalfDay,
                                },
                                {
                                    start_half_day: startHalfDay,
                                    end_half_day: endHalfDay,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    });
    if (!overlappingLeave) {
        if (!startHalfDay && !endHalfDay) {
            overlappingLeave = await LeaveRequest.findOne({
                where: {
                    employee_id: employeeId,
                    deleted_at: null,
                    status: {
                        [Op.in]: ["approved_lm","approved_hod", "pending"]
                    },
                    start_date: {
                        [Op.gte]: startDate,
                    },
                    end_date: {
                        [Op.lte]: endDate,
                    },
                },
            });
        }

        if ((startHalfDay === "am" || startHalfDay === "pm") || (endHalfDay === "am" || endHalfDay === "pm")) {
            if (startHalfDay === "am" || startHalfDay === "pm") {
                const overlappingLeave1 = await LeaveRequest.findOne({
                    where: {
                        employee_id: employeeId,
                        deleted_at: null,
                        status: {
                            [Op.in]: ["approved_lm","approved_hod", "pending"]
                        },
                        start_date: startDate,
                        start_half_day: startHalfDay,
                    },
                });
                if (overlappingLeave1) {
                    return true; // Overlap detected
                }
            }
            if (endHalfDay === "am" || endHalfDay === "pm") {
                const overlappingLeave2 = await LeaveRequest.findOne({
                    where: {
                        employee_id: employeeId,
                        deleted_at: null,
                        status: {
                            [Op.in]: ["approved_lm","approved_hod", "pending"]
                        },
                        end_date: endDate,
                        end_half_day: endHalfDay,
                    },
                });
                if (overlappingLeave2) {
                    return true; // Overlap detected
                }
            }
            const dataLeaves = await LeaveRequest.findOne({
                where: {
                    employee_id: employeeId,
                    deleted_at: null,
                    status: {
                        [Op.in]: ["approved_lm","approved_hod", "pending"]
                    },
                    start_date: {
                        [Op.lte]: startDate,
                    },
                    end_date: {
                        [Op.gte]: endDate,
                    },
                },
            });
            if (dataLeaves) {
                if (!dataLeaves.start_half_day && !dataLeaves.end_half_day) {
                    return true; // Overlap detected
                }
            }
        }
    }
    if (overlappingLeave) {
        return true;
    }
}
function countWeekdays(startDate, endDate) {
    // Parse the input dates
    const start = parse(startDate, 'yyyy-MM-dd', new Date());
    const end = parse(endDate, 'yyyy-MM-dd', new Date());

    // Generate the interval between the two dates
    const interval = eachDayOfInterval({ start, end });

    // Filter out weekends (Saturday and Sunday)
    const weekdays = interval.filter(date => !isWeekend(date));

    // Return the count of weekdays
    return weekdays.length;
}

const createRequestLeave = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Leave Requests']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { 
        leave_type_id,
        start_date,
        end_date,
        start_half_day,
        end_half_day,
        number_of_day,
        handover_staff_id,
        delegate_id,
        reason,
     } = req.body;
     const data = {
        ...req.body,
        start_date: moment(req.body.start_date).format('YYYY-MM-DD', true),
        end_date: moment(req.body.end_date).format('YYYY-MM-DD', true),
        start_half_day: req.body.start_half_day || null,
        end_half_day: req.body.end_half_day || null,
    };
    const startDate =  moment(req.body.start_date).format('YYYY-MM-DD', true);
    const endDate =  moment(req.body.end_date).format('YYYY-MM-DD', true);
    const transaction = await db.sequelize.transaction();

    const userAuth = JWTProvider.getTokenUser(req);
    // try {
        const userId = userAuth.Auth.id; // Assuming user authentication middleware sets req.user
        const duplicate = await duplicateLeave(data, userId);
        if (duplicate) {
            return res.status(404).json({
                error: 'Start date and end date already exists',
                status: 404,
            });
        }
        const leaveAllocation = await LeaveAllocation.findOne({ where: { employee_id: userId }, transaction });
        const leaveType = await LeaveType.findByPk(req.body.leave_type_id, { transaction });
        
        data.line_manager_id = userAuth.Auth.line_manager;

        const dataBranch = await Branch.findByPk(userAuth.Auth.branch_id, { transaction });
        const dataDepartment = await Department.findByPk(userAuth.Auth.department_id, { transaction });
       
        data.next_approver = dataBranch.abbreviations === "HQ" 
            ? dataDepartment.direct_manager_id 
            : dataBranch.direct_manager_id;

        data.status = "pending";
        
        // Role-based approvals
        if(userAuth.role_type == "BOD") {
            data.status = "approved_hod";
            data.next_approver = null;
        }else if (userAuth.role_type == "CEO") {
            data.next_approver = userAuth.Auth.line_manager;

        }else if (userAuth.role_type == "HOD" && userId === dataDepartment.direct_manager_id) {
            data.next_approver = userAuth.Auth.line_manager;

        }else if(userAuth.role_type == "BM" && userId == dataBranch.direct_manager_id){
            data.next_approver = userAuth.Auth.line_manager;

        }else if(userAuth.role_type == "HRAdmin" && userId == dataDepartment.direct_manager_id){
            data.next_approver = userAuth.Auth.line_manager;
        }
        const requestDate = moment().format('YYYY-MM-DD');
        const delegateLeave = await DelegateLeave.findOne({
            where: {
                requester_id: data.next_approver,
                start_date: { [Op.lte]: requestDate },
                end_date: { [Op.gte]: requestDate },
            },
            transaction,
        });

        if (delegateLeave) {
            data.next_approver = delegateLeave.delegate_id;
            const delegateLeaveRequest = await LeaveRequest.findOne({
                where: {
                    employee_id: delegateLeave.delegate_id,
                    start_date: { [Op.lte]: requestDate },
                    end_date: { [Op.gte]: requestDate },
                },
                transaction,
            });
            if (delegateLeaveRequest) {
                const lineNumber1 = countWeekdays(requestDate, delegateLeave.end_date);
                const lineNumber2 = countWeekdays(requestDate, delegateLeaveRequest.end_date);
                data.next_approver = lineNumber1 <= lineNumber2 ? delegateLeave.requester_id : delegateLeaveRequest.employee_id;
            }
        }

        if (req.body.delegate_id) {
            await DelegateLeave.create({
                requester_id: userId,
                delegate_id: req.body.delegate_id,
                number_of_day: req.body.number_of_day,
                start_date:startDate ,
                end_date: endDate,
            }, { transaction });
        }

        if (!leaveType) {
            return res.status(404).json({ error: 'Leave type not found' });
        }

        if (!leaveAllocation) {
            await LeaveAllocation.create({
                employee_id: userId,
                default_annual_leave: 0,
                default_sick_leave: 0,
                default_special_leave: 0,
                default_unpaid_leave: 0,
                total_annual_leave: 0 - req.body.number_of_day,
                total_sick_leave: 0,
                total_special_leave: 0,
                total_unpaid_leave: 0,
                created_by: userId,
            }, { transaction });
        } else {
            // leaveAllocation.total_annual_leave += leaveType.type === "annual_leave" ? - req.body.number_of_day : 0;
            // leaveAllocation.total_sick_leave += leaveType.type === "sick_leave" ? - req.body.number_of_day : 0;
            // leaveAllocation.total_special_leave += leaveType.type === "special_leave" ? - req.body.number_of_day : 0;
            // leaveAllocation.total_unpaid_leave += leaveType.type === "unpaid_leave" ? - req.body.number_of_day : 0;

            leaveAllocation.total_annual_leave = leaveType.type == "annual_leave" ? parseFloat(leaveAllocation.total_annual_leave) - req.body.number_of_day : leaveAllocation.total_annual_leave;
            leaveAllocation.total_sick_leave = leaveType.type == "sick_leave" ? parseFloat(leaveAllocation.total_sick_leave) - req.body.number_of_day : leaveAllocation.total_sick_leave;
            leaveAllocation.total_special_leave = leaveType.type == "special_leave" ? parseFloat(leaveAllocation.total_special_leave) - req.body.number_of_day : leaveAllocation.total_special_leave;
            leaveAllocation.total_unpaid_leave = leaveType.type == "unpaid_leave" ? parseFloat(leaveAllocation.total_unpaid_leave) - req.body.number_of_day : leaveAllocation.total_unpaid_leave;
            leaveAllocation.total_long_sick_leave = leaveType.type == "long_sick_leave" ? parseFloat(leaveAllocation.total_long_sick_leave) - req.body.number_of_day : leaveAllocation.total_long_sick_leave;
            await leaveAllocation.save({ transaction });
        }
      
        data.employee_id = userId;
        data.created_by = userId;
        data.start_date =  startDate;
        data.end_date =  endDate;

        let resulf = await LeaveRequest.create(data, { transaction });

        await transaction.commit();
        return res.status(200).json({
            success: 'leave request created successfully',
            status: 200,
            data: resulf,
        });
    // } catch (error) {
    //     await transaction.rollback();
    //     console.error('Error creating leave request:', error);
    //     return res.status(500).json({ error: 'Leave request creation failed.' });
    // }
});

const updateLeaveRequest = catchAsync(async (req, res, next) => {
     /* #swagger.tags = ['Leave Requests']
    * #swagger.security = [{"bearerAuth": []}]
    */
    //  const transaction = await db.sequelize.transaction();
    // try {
        const userAuth = JWTProvider.getTokenUser(req);
        const userId = userAuth.Auth.id; 
        const { id, leave_type_id, start_date, end_date, start_half_day, end_half_day, number_of_day, reason, delegate_id } = req.body;

        const dataDubplicate = {
            ...req.body,
            start_date: moment(req.body.start_date).format('YYYY-MM-DD', true),
            end_date: moment(req.body.end_date).format('YYYY-MM-DD', true),
            start_half_day: req.body.start_half_day || null,
            end_half_day: req.body.end_half_day || null,
        };
        const duplicate = await duplicateLeave(dataDubplicate, userId);
        if (duplicate) {
            return res.status(404).json({ error: 'Start date and End date already exists' });
        }

        const leaveAllocation = await LeaveAllocation.findOne({ where: { employee_id: userId } });
        const leaveType = await LeaveType.findByPk(leave_type_id);
        const data = await LeaveRequest.findByPk(id, { include: ['leaveType'] });
        const delegateLeave = await DelegateLeave.findOne({
            where: { requester_id: data.employee_id, start_date: data.start_date, end_date: data.end_date }
        });
        let numberDayDiff = 0;
        if (leaveType.type === data.leaveType.type) {
            
            if (parseFloat(number_of_day) == parseFloat(data.number_of_day)) {
                numberDayDiff = 0;
            }else{
                numberDayDiff = parseFloat(data.number_of_day) - parseFloat(number_of_day) ;
            }
            leaveAllocation["total_annual_leave"] = leaveType.type === 'annual_leave' ? parseFloat(leaveAllocation.total_annual_leave) + numberDayDiff : leaveAllocation.total_annual_leave;
            leaveAllocation["total_sick_leave"] = leaveType.type === 'sick_leave' ? parseFloat(leaveAllocation.total_sick_leave) + numberDayDiff : leaveAllocation.total_sick_leave;
            leaveAllocation["total_special_leave"] = leaveType.type === 'special_leave' ? parseFloat(leaveAllocation.total_special_leave) + numberDayDiff : leaveAllocation.total_special_leave;
            leaveAllocation["total_unpaid_leave"] = leaveType.type === 'unpaid_leave' ? parseFloat(leaveAllocation.total_unpaid_leave) + numberDayDiff : leaveAllocation.total_unpaid_leave;
            leaveAllocation["total_long_sick_leave"] = leaveType.type === 'long_sick_leave' ? parseFloat(leaveAllocation.total_long_sick_leave) + numberDayDiff : leaveAllocation.total_long_sick_leave;
            
            await leaveAllocation.save({ transaction });
        } else {
            // // Adjust old leave allocation
            const adjustLeave = (type, numberDay) => {
                leaveAllocation[`total_${type}`] = (parseFloat(leaveAllocation[`total_${type}`]) + parseFloat(numberDay));
            };
            adjustLeave(data.leaveType.type, number_of_day);

            // // Adjust new leave allocation
            leaveAllocation[`total_${leaveType.type}`] -= number_of_day;
            await leaveAllocation.save({ transaction });
        }
        
        // Update or create delegate leave
        if (delegateLeave) {
            delegateLeave.delegate_id = delegate_id || delegateLeave.delegate_id;
            delegateLeave.start_date = start_date;
            delegateLeave.end_date = end_date;
            delegateLeave.number_of_day = number_of_day;
            await delegateLeave.save({ transaction });
        } else if (delegate_id) {
            await DelegateLeave.create({
                requester_id: userId,
                delegate_id,
                number_of_day,
                start_date,
                end_date,
            }, { transaction });
        }

        // Update leave request
        data.leave_type_id = leave_type_id;
        data.start_date = start_date;
        data.start_half_day = start_half_day;
        data.end_date = end_date;
        data.end_half_day = end_half_day;
        data.number_of_day = number_of_day;
        data.reason = reason;
        data.updated_by = userId;
        await data.save({ transaction });

        await transaction.commit(); // Commit transaction

        return res.status(200).json({ success: 'leave_request_created_successfully' });
    // } catch (error) {
    //     await transaction.rollback(); // Rollback transaction
    //     console.error(error);
    //     return res.status(500).json({ error: 'Leave request update failed' });
    // }
});

const approveLeave = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Leave Requests']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { id, remark } = req.body;
    const userAuth = JWTProvider.getTokenUser(req);
    const userId = userAuth.Auth.id;

    try {
        const data = await LeaveRequest.findOne({
        where: { id },
        include: [
            {
                model: User, 
                attributes: ['employee_name_kh','employee_name_en', 'branch_id', 'department_id'],
                required: false,
            }
        ]
        });

        const dataDepartment = await Department.findOne({
            where: { id: data.User.department_id },
        });

        const dataBranch = await Branch.findOne({
            where: { id: data.User.branch_id },
        });

        const role = userAuth.role_type;

        const requestDate = moment(data.created_at).format('YYYY-MM-DD');

        const delegateLeave = DelegateLeave.findAll({
            where: {
                delegate_id: data.next_approver,
                start_date: { $lte: requestDate },
                end_date: { $gte: requestDate },
            }
        });
        
        const delegateLeaveDepartment = await DelegateLeave.findOne({
            where: { requester_id: dataDepartment.direct_manager_id },
        });

        if (['HOD', 'CEO', 'BOD'].includes(role)) {
            const department = userAuth.Auth.Department;
            if (delegateLeaveDepartment) {
                data.next_approver = null;
                data.status = 'approved_hod';
            } else {
                if (userId == department.direct_manager_id || ['CEO', 'BOD'].includes(role)) {
                data.next_approver = null;
                data.status = 'approved_hod';
                } else {
                const leaveDepartment = await DelegateLeave.findOne({
                    where: {
                    requester_id: dataDepartment.direct_manager_id,
                    start_date: { $lte: requestDate },
                    end_date: { $gte: requestDate }
                    }
                });

                data.status = 'approved_lm';

                if (leaveDepartment) {
                    const delegate = await DelegateLeave.findOne({
                    where: {
                        requester_id: leaveDepartment.delegate_id,
                        start_date: { $lte: requestDate },
                        end_date: { $gte: requestDate }
                    }
                    });

                    if (delegate) {
                    data.next_approver = leaveDepartment.number_of_day < delegate.number_of_day ? delegate.requester_id : leaveDepartment.delegate_id;
                    } else {
                    data.next_approver = leaveDepartment.delegate_id;
                    }
                } else {
                    data.next_approver = department.direct_manager_id;
                }
                }
            }
        } else if (role === 'BM') {
            const delegateLeaveBranch = await DelegateLeave.findOne({
                where: { requester_id: dataBranch.direct_manager_id },
            });

            const branch = userAuth.Auth.Branch;;

            if (delegateLeaveBranch) {
                data.next_approver = null;
                data.status = 'approved_hod';
            } else {
                if (branch.direct_manager_id == userId) {
                data.next_approver = null;
                data.status = 'approved_hod';
                } else {
                const leaveBranch = await DelegateLeave.findOne({
                    where: {
                    requester_id: dataBranch.direct_manager_id,
                    start_date: { $lte: requestDate },
                    end_date: { $gte: requestDate }
                    }
                });

                data.status = 'approved_lm';

                if (leaveBranch) {
                    const delegate = await DelegateLeave.findOne({
                    where: {
                        requester_id: leaveBranch.delegate_id,
                        start_date: { $lte: requestDate },
                        end_date: { $gte: requestDate }
                    }
                    });

                    if (delegate) {
                    data.next_approver = leaveBranch.number_of_day < delegate.number_of_day ? delegate.requester_id : leaveBranch.delegate_id;
                    } else {
                    data.next_approver = leaveBranch.delegate_id;
                    }
                } else {
                    data.next_approver = branch.direct_manager_id;
                }
                }
            }
        } else if (['HR', 'HRAdmin'].includes(role)) {
            data.status = 'approved';
        }

        // data.remark = remark;
        data.approved_date = moment();
        data.approved_by = data.approved_by ? `${data.approved_by},${userId}` : userId;

        await data.save();

        res.status(200).json({
        message: 'The process has been successfully completed.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})
const rejectLeave = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Leave Requests']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const { id, remark, status } = req.body;

    try {
        // Find the Leave Request with associated LeaveType
        const data = await LeaveRequest.findOne({
            where: { id },
            include: [
                {
                    model: LeaveType,
                    attributes: ['name','type'],
                    required: false,
                },
            ],
        });
        
        if (!data) {
        return res.status(404).json({ message: "Leave Request not found" });
        }

        const leaveAllocation = await LeaveAllocation.findOne({
            where: { employee_id: data.employee_id },
        });

        if (!leaveAllocation) {
        return res.status(404).json({ message: "Leave Allocation not found" });
        }
        // Update leave balances based on leave type
        const { type } = data.leaveType;
        const { number_of_day } = data;

        if (type === "annual_leave") {
            const currentAnnualLeave = leaveAllocation.total_annual_leave + number_of_day;
            leaveAllocation.total_annual_leave = Math.min(
                currentAnnualLeave,
                leaveAllocation.default_annual_leave
        );
        } else if (type === "sick_leave") {
            const currentSickLeave = leaveAllocation.total_sick_leave + number_of_day;
            leaveAllocation.total_sick_leave = Math.min(
                currentSickLeave,
                leaveAllocation.default_sick_leave
        );
        } else if (type === "special_leave") {
            const currentSpecialLeave = leaveAllocation.total_special_leave + number_of_day;
            leaveAllocation.total_special_leave = Math.min(
                currentSpecialLeave,
                leaveAllocation.default_special_leave
        );
        } else if (type === "unpaid_leave") {
            const currentUnpaidLeave = leaveAllocation.total_unpaid_leave + number_of_day;
            leaveAllocation.total_unpaid_leave = Math.max(0, currentUnpaidLeave);
        } else if (type === "long_sick_leave") {
            const currentLongSickLeave = leaveAllocation.total_long_sick_leave + number_of_day;
            leaveAllocation.total_long_sick_leave = Math.max(0, currentLongSickLeave);
        }

        // Determine status based on role
        const userAuth = JWTProvider.getTokenUser(req);
        const userId = userAuth.Auth.id;
        const department = userAuth.Auth.Department;
        const branch = userAuth.Auth.Branch;

        if (["HOD", "CEO", "BOD"].includes(userAuth.role_type)) {
            if (userId === department.direct_manager_id || ["CEO", "BOD"].includes(userAuth.role_type)) {
                data.status = status === "cancel_hod" ? "cancel_hod" : "rejected_hod";
            } else {
                data.status = "rejected_lm";
            }
        } else if (userAuth.role_type === "BM") {
            if (branch.direct_manager_id === userId) {
                data.status = status === "cancel_hod" ? "cancel_hod" : "rejected_hod";
            } else {
                data.status = "rejected_lm";
            }
        } else if (["HR", "HRAdmin"].includes(userAuth.role_type)) {
            data.status = status === "cancel" ? "cancel" : "rejected";
        }

        // Delete corresponding DelegateLeave entries
        await DelegateLeave.destroy({
            where: {
                requester_id: Number(data.employee_id),
                start_date: new Date(data.start_date),
                end_date: new Date(data.end_date),
            },
        });

        // Update data and leaveAllocation
        data.remark = remark;
        await data.save();
        await leaveAllocation.save();

        res.status(200).json({ message: "The process has been successfully completed." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})
const deleteLeave = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Leave Requests']
    * #swagger.security = [{"bearerAuth": []}]
    */
    const transaction = await db.sequelize.transaction();
    try {
        // Fetch the LeaveRequest with related leaveType
        const data = await LeaveRequest.findOne({
            where: { id: req.body.id },
            include: [{ model: LeaveType, required: false, }],
            transaction,
        });
        if (!data) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        // Fetch LeaveAllocation for the employee
        const leaveAllocation = await LeaveAllocation.findOne({
            where: { employee_id: data.employee_id },
            transaction,
        });

        if (!leaveAllocation) {
            return res.status(404).json({ message: 'Leave allocation not found' });
        }

        // Adjust leave allocation based on leave type
        const leaveType = data.leaveType.type;
        const numberOfDays = parseFloat(data.number_of_day);

        if (leaveType === 'annual_leave') {
            const currentAnnualLeave = parseFloat(leaveAllocation.total_annual_leave) + numberOfDays;
            leaveAllocation.total_annual_leave = currentAnnualLeave > leaveAllocation.default_annual_leave ? leaveAllocation.default_annual_leave : currentAnnualLeave;
        } else if (leaveType === 'sick_leave') {
            const currentSickLeave = parseFloat(leaveAllocation.total_sick_leave) + numberOfDays;
            leaveAllocation.total_sick_leave = currentSickLeave > leaveAllocation.default_sick_leave ? leaveAllocation.default_sick_leave : currentSickLeave;
        } else if (leaveType === 'special_leave') {
            const currentSpecialLeave = parseFloat(leaveAllocation.total_special_leave) + numberOfDays;
            leaveAllocation.total_special_leave = currentSpecialLeave > leaveAllocation.default_special_leave ? leaveAllocation.default_special_leave : currentSpecialLeave;
        } else if (leaveType === 'unpaid_leave') {
            const currentUnpaidLeave = parseFloat(leaveAllocation.total_unpaid_leave) + numberOfDays;
            leaveAllocation.total_unpaid_leave = currentUnpaidLeave > leaveAllocation.default_unpaid_leave ? leaveAllocation.default_unpaid_leave : currentUnpaidLeave;
        } else if (leaveType === 'long_sick_leave') {
            const currentLongSickLeave = parseFloat(leaveAllocation.total_long_sick_leave) + numberOfDays;
            leaveAllocation.total_long_sick_leave = currentLongSickLeave > leaveAllocation.default_long_sick_leave ? leaveAllocation.default_long_sick_leave : currentLongSickLeave;
        }

        // Save the updated leave allocation
        await leaveAllocation.save({ transaction });

        // Delete related delegate leave records
        await DelegateLeave.destroy({
            where: {
                requester_id: Number(data.employee_id),
                start_date: new Date(data.start_date),
                end_date: new Date(data.end_date),
            },
            transaction,
        });

        // Delete the leave request
        await LeaveRequest.destroy({ where: { id: req.body.id }, transaction });

        // Commit the transaction
        await transaction.commit();

        // Success response
        return res.status(200).json({ message: 'Leave request deleted successfully' });
    } catch (error) {
        // Rollback transaction in case of error
        await transaction.rollback();

        // Error response
        return res.status(500).json({ message: 'Leave request deletion failed', error: error.message });
    }
})

module.exports = {
    getLeaveRequests,
    getLeaveApproves,
    getEmployees,
    createRequestLeave,
    updateLeaveRequest,
    approveLeave,
    rejectLeave,
    deleteLeave,
};