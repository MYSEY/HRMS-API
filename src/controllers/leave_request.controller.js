const db = require('../models');
const { HttpBadRequest } = require('../services/error');
const catchAsync = require('../utils/catchAsync');
import { Math } from "core-js";
import moment from "moment";
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
            // where:{ employee_id: userAuth.Auth.id},
            // limit: limit,
            // offset: offset,
            // attributes: [],
            order: [['id', 'DESC']],
            include: [
                {
                    model: LeaveType, // Reference the associated model
                    attributes: ['name'], // Specify fields you want from LeaveType
                    required: false, // This ensures a LEFT JOIN (not INNER JOIN)
                },
            ],
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
const getLeaveRequestId = catchAsync(async (req, res, next) => {
    /* #swagger.tags = ['Leave Requests']
    * #swagger.security = [{"bearerAuth": []}]
    */
    let { id } = req.query;
    const LeaveRequest = await LeaveRequest.findOne({where: { id } });
    if (!LeaveRequest) return next(new HttpBadRequest("Leave Request not found", 404));
    res.status(200).json({
        'status': true,
        'data': LeaveRequest
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
        console.log("numberOfDays: ", numberOfDays);

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
                requester_id: data.employee_id,
                start_date: data.start_date,
                end_date: data.end_date,
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
    getLeaveRequestId,
    getEmployees,
    createRequestLeave,
    updateLeaveRequest,
    deleteLeave
};