const { timestampHook } = require("../hooks");

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('otp', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      unique: true
    },
    otp: {
      type: DataTypes.STRING(6),
    },
    expires_at: {
      type: DataTypes.BIGINT,
    },
    created_at: {
      type: DataTypes.BIGINT
    },
    updated_at: {
      type: DataTypes.BIGINT
    }
  },
    {
      tableName: 'otp',
      timestamps: false,
      hooks: timestampHook,
    });
};