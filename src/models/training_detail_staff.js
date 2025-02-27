module.exports = (sequelize, DataTypes) => {
  const TrainingDetailStaff = sequelize.define("TrainingDetailStaff", {
      id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
      },
      training_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
      },
      employee_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
      },
      created_by: {
          type: DataTypes.BIGINT,
          allowNull: true,
      },
      updated_by: {
          type: DataTypes.BIGINT,
          allowNull: true,
      },
      deleted_at: {
          type: DataTypes.DATE,
          allowNull: true,
      },
  }, {
      tableName: 'training_detail_staff',
      timestamps: false
  });

  return TrainingDetailStaff;
};
