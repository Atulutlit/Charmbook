const db = require("./models");
const tables = require("./relationship");

exports.tables = tables;
exports.Sequelize = db.Sequelize;
exports.sequelize = db.sequelize;

exports.connectDB = async () => {
   try {
      await db.sequelize.authenticate();
      console.log("[app] Database connection successful");
       await db.sequelize.sync({ logging: false, force: false});    
   } catch (error) {
      console.log("[app] Error creating connection:", error);
   }
};