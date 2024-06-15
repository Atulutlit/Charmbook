const { timestampHook } = require("../hooks");

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('class', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    class_name: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.BIGINT
    },
    updated_at: {
      type: DataTypes.BIGINT
    }
  },
    {
      tableName: 'class',
      timestamps: false,
      hooks: timestampHook,
    });
};