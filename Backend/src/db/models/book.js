const { timestampHook } = require("../hooks");

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('book', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING
    },
    subject_id: {
      type: DataTypes.INTEGER
    },
    author: {
      type: DataTypes.STRING
    },
    class_id: {
      type: DataTypes.INTEGER
    },
    description: {
      type: DataTypes.STRING
    },
    cover_image_url: {
      type: DataTypes.STRING
    },
    file_url: {
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
      tableName: 'book',
      timestamps: false,
      hooks: timestampHook,
    });
};