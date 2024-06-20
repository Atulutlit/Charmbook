const { timestampHook } = require("../hooks");

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('tests', {
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
    },
    test_file_url:{
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
    class_id:{
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
      tableName: 'tests',
      timestamps: false,
      hooks: timestampHook,
    });
};