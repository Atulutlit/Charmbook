const { tables, sequelize } = require('../db/index.js');
const { Op } = require("sequelize");
const {findDatesBetween, isSunday} = require("../utils/common.js")
const cron = require("node-cron");
let date = new Date();

date.setUTCHours(0, 0, 0, 0);

cron.schedule("0 0 * * *", async() => {
  try {

    const students = await tables.User.findAll({
      where: {
        role: "STUDENT",
        status: "ACTIVE"
      },
      raw:true
    })

    console.log(students,'cronn schedulin');

    const sunday = isSunday(date);

    for (const student of students){

      if(sunday){

        const sundayDate = new Date();

        sundayDate.setDate(sundayDate.getDate() + 1);

        await tables.Holiday.create({
          holiday_name: "sunday",
          date: sundayDate
        });

      }

      const holiday = await tables.Holiday.findOne({
        where: {
          date: sequelize.where(sequelize.fn('DATE', sequelize.col('date')), '=', sequelize.fn('DATE', date)),
        }
      })

      if(holiday){
        await tables.Attendance.create({
          class_id: student.class_id,
          student_id: student.id,
          date: date,
          status: "HOLIDAY",
        })

      } else {
        await tables.Attendance.create({
          class_id: student.class_id,
          student_id: student.id,
          date: date,
          status: "PENDING",
        })
      }
    }

  } catch (error) {
    console.error("Error:", error.message);
    console.log("cron scheduler error");
  }

});