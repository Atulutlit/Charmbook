const { timestampHook } = require("../hooks");

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('school_schedule', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    start_time: {
      type: DataTypes.TIME
    },
    end_time: {
      type: DataTypes.TIME
    },
    created_at: {
      type: DataTypes.BIGINT
    },
    updated_at: {
      type: DataTypes.BIGINT
    }
  },
    {
      tableName: 'school_schedule',
      timestamps: false,
      hooks: timestampHook,
    });
};