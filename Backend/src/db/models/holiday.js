const { timestampHook } = require("../hooks");

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('holiday', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    holiday_name: {
      type: DataTypes.STRING
    },
    date:{
      type: DataTypes.DATE
    },
    created_at: {
      type: DataTypes.BIGINT
    },
    updated_at: {
      type: DataTypes.BIGINT
    }
  },
    {
      tableName: 'holiday',
      timestamps: false,
      hooks: timestampHook,
    });
};