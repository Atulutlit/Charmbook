const { timestampHook } = require("../hooks");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Notification', {
    message: {
      type: DataTypes.STRING,
      allowNull: false, // It's good to ensure that a message cannot be empty
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false, // Ensure user_id is not null
    },
  }, {
    tableName: 'notification', // This specifies the exact table name in the database
    timestamps: false, // If you have custom timestamp hooks, ensure they are correctly defined in the hook
    hooks: timestampHook,
  });
};
