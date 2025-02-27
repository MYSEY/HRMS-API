module.exports = (sequelize, DataTypes) => {
    const TrainingDetailTrainer = sequelize.define("TrainingDetailTrainer", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
          },
          training_id: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          trainer_id: {
            type: DataTypes.STRING,
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
        tableName: 'training_detail_trainers',
        timestamps: false
    });

    return TrainingDetailTrainer
}