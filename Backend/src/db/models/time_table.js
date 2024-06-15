const { timestampHook } = require("../hooks");

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('time_table', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    class_id: {
      type: DataTypes.INTEGER,
    },
    subject_id: {
      type: DataTypes.INTEGER
    },
    teacher_id:{
      type: DataTypes.INTEGER
    },
    start_time: {
      type: DataTypes.TIME
    },
    end_time: {
      type: DataTypes.TIME
    },
    period_no: {
      type: DataTypes.INTEGER
    },
    created_at: {
      type: DataTypes.BIGINT
    },
    updated_at: {
      type: DataTypes.BIGINT
    }
    
  },
    {
      tableName: 'time_table',
      timestamps: false,
      hooks: timestampHook,
    });
};