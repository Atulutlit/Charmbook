const { timestampHook } = require("../hooks");

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('attendance', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    enrollment_no:{
      type: DataTypes.STRING
    },
    class_id: {
      type: DataTypes.INTEGER
    },
    student_id: {
      type: DataTypes.INTEGER
    },
    date:{
      type: DataTypes.STRING
    },
    time:{
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.ENUM(['PRESENT', 'ABSENT','HOLIDAY','PENDING']),
      allowNull: false
    },
    is_present: {
      type: DataTypes.BOOLEAN
    },
    created_at: {
      type: DataTypes.BIGINT
    },
    updated_at: {
      type: DataTypes.BIGINT
    }
  },
    {
      tableName: 'attendance',
      timestamps: false,
      hooks: timestampHook,
    });
};