const { timestampHook } = require("../hooks");

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('homework', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    teacher_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    file_url:{
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    date:{
      type: DataTypes.DATE,
      allowNull: true
    },
    class_id: {
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
      tableName: 'homework',
      timestamps: false,
      hooks: timestampHook,
    });
};