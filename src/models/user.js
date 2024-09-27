// const role = require("./role");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        number_employee: {
            type: DataTypes.STRING,
            // unique: true,
            allowNull: false
        },
        last_name_kh: {
            type: DataTypes.STRING,
            // unique: true,
            allowNull: false
        },
        first_name_kh: {
            type: DataTypes.STRING,
            // unique: true,
            allowNull: false
        },
        last_name_en: {
            type: DataTypes.STRING,
            // unique: true,
            allowNull: false
        },
        first_name_en: {
            type: DataTypes.STRING,
            // unique: true,
            allowNull: false
        },
        employee_name_kh: {
            type: DataTypes.STRING,
            // unique: true,
            allowNull: false
        },
        employee_name_en: {
            type: DataTypes.STRING,
            // unique: true,
            allowNull: false
        },
        gender: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: null
        },
        date_of_birth: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: null
        },
        spouse: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: null
        },
        id_card_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_number_nssf: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        department_id: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        position_id: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        branch_id: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        profile: {
            type: DataTypes.STRING,
        },
        role_id: {
            type: DataTypes.STRING,
            // references: {
            //     model: role, // 'roles' would also work
            //     key: 'id'
            // },
        },
        unit: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        level: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        line_manager: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: null
        },
        date_of_commencement: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: null
        },
        pre_salary: {
            type: DataTypes.DECIMAL(50,2),
            allowNull: false,
            defaultValue: null
        },
        basic_salary: {
            type: DataTypes.DECIMAL(50,2),
            allowNull: false,
            defaultValue: null
        },
        salary_increas: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: null
        },
        change_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: null
        },
        phone_allowance: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: null
        },
        email_verified_at: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        password: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        position_type: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        nationality: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        ethnicity: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        guarantee_letter: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        employment_book: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        identity_type: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        identity_number: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        issue_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: null
        },
        issue_expired_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: null
        },
        type_of_employees_nssf: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        spouse_nssf: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        status_nssf: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        is_type_nssf: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: null
        },
        current_province: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },

        current_district: {
             type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        current_commune: {
             type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        current_village: {
             type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        current_house_no: {
             type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        current_street_no: {
             type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        permanent_province: {
             type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        permanent_district: {
             type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        permanent_commune: {
             type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        permanent_village: {
             type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        permanent_house_no: {
             type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        permanent_street_no: {
             type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        company_phone_number: {
             type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        personal_phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        agency_phone_number: {
             type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        marital_status: {
             type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        fdc_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: null
        },
        fdc_end: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: null
        },
        udc_end_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: null
        },
        resign_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: null
        },
        resign_reason:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        remark:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        bank_name:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        account_name:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        account_number:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        users_permission:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: null
        },
        status:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        emp_status:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        p_status:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: null
        },
        is_loan:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: null
        },
        type:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: null
        },
        created_by:{
            type: DataTypes.INTEGER,
        },
        updated_by:{
            type: DataTypes.INTEGER,
        },
    },{
        tableName: 'users', // Ensure table name matches
        timestamps: false    // Disable timestamps
      });

    return User
}