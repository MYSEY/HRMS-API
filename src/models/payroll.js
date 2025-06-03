module.exports = (sequelize, DataTypes) => {
    const Payroll = sequelize.define("payrolls", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
          },
          employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          basic_salary: {
            type: DataTypes.DECIMAL(50, 2),
            defaultValue: 0,
          },
          total_gross_salary: {
            type: DataTypes.DECIMAL(50),
            defaultValue: 0,
          },
          payment_date: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          total_child_allowance: {
            type: DataTypes.DECIMAL(50, 2),
            defaultValue: 0,
          },
          phone_allowance: {
            type: DataTypes.DECIMAL,
            allowNull: true,
          },
          monthly_quarterly_bonuses: {
            type: DataTypes.DECIMAL,
            allowNull: true,
          },
          total_kny_phcumben: {
            type: DataTypes.DECIMAL(50, 2),
            defaultValue: 0,
          },
          annual_incentive_bonus: {
            type: DataTypes.DECIMAL(50, 2),
            defaultValue: 0,
          },
          seniority_pay_included_tax: {
            type: DataTypes.DECIMAL(50, 2),
            defaultValue: 0,
          },
          total_pension_fund: {
            type: DataTypes.DECIMAL(50, 2),
            defaultValue: 0,
          },
          other_benefits: {
            type: DataTypes.DECIMAL(50, 2),
            defaultValue: 0,
          },
          total_severance_pay: {
            type: DataTypes.DECIMAL(50, 2),
            defaultValue: 0,
          },
          loan_amount: {
            type: DataTypes.DECIMAL(50, 2),
            defaultValue: 0,
          },
          total_amount_car: {
            type: DataTypes.DECIMAL(50, 2),
            defaultValue: 0,
          },
          total_staff_book: {
            type: DataTypes.DECIMAL(50, 2),
            defaultValue: 0,
          },
          base_salary_received_usd: {
            type: DataTypes.DECIMAL(50, 2),
            defaultValue: 0,
          },
          base_salary_received_riel: {
            type: DataTypes.STRING(50),
            defaultValue: '0',
          },
          spouse: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
          },
          children: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
          },
          total_charges_reduced: {
            type: DataTypes.STRING(50),
            defaultValue: '0',
          },
          total_tax_base_riel: {
            type: DataTypes.STRING(50),
            defaultValue: '0',
          },
          total_rate: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
          },
          total_salary_tax_usd: {
            type: DataTypes.DECIMAL(50, 2),
            defaultValue: 0,
          },
          total_salary_tax_riel: {
            type: DataTypes.STRING(50),
            defaultValue: '0',
          },
          seniority_pay_excluded_tax: {
            type: DataTypes.STRING(50),
            defaultValue: '0',
          },
          total_amount_reduced: {
            type: DataTypes.DECIMAL(50, 2),
            defaultValue: 0,
          },
          total_salary: {
            type: DataTypes.DECIMAL,
            defaultValue: 0,
          },
          exchange_rate: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          adjustment: {
            type: DataTypes.STRING,
            defaultValue: 0,
          },
          adjustment_include_taxe: {
            type: DataTypes.STRING,
            defaultValue: 0,
          },
          created_by: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
          },
          updated_by: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
          },
          deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
          updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
    }, {
        tableName: 'payrolls',
        timestamps: false
    });

    return Payroll
}
