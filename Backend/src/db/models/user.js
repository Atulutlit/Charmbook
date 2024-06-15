const { timestampHook } = require("../hooks");

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    enrollment_no: {
      type: DataTypes.STRING
    },
    profile_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
    },
    phone_no: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    class_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    role: {
      type: DataTypes.ENUM("STUDENT", "TEACHER")
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE"
    },
    token : {
      type: DataTypes.STRING
    },
    created_at: {
      type: DataTypes.BIGINT
    },
    updated_at: {
      type: DataTypes.BIGINT
    }
  },
    {
      tableName: 'user',
      timestamps: false,
      hooks: timestampHook,
    });
};