// const { tables, sequelize } = require('../db/index.js');
// const { Op } = require("sequelize");
// const {findDatesBetween, isSunday} = require("../utils/common.js")
// const cron = require("node-cron");
// let date = new Date();

// date.setUTCHours(0, 0, 0, 0);

// cron.schedule("0 0 * * *", async() => {
//   try {

//     const students = await tables.User.findAll({
//       where: {
//         role: "STUDENT",
//         status: "ACTIVE"
//       },
//       raw:true
//     })

//     console.log(students,'cronn schedulin');

//     const sunday = isSunday(date);

//     for (const student of students){

//       if(sunday){

//         const sundayDate = new Date();

//         sundayDate.setDate(sundayDate.getDate() + 1);

//         await tables.Holiday.create({
//           holiday_name: "sunday",
//           date: sundayDate
//         });

//       }

//       const holiday = await tables.Holiday.findOne({
//         where: {
//           date: sequelize.where(sequelize.fn('DATE', sequelize.col('date')), '=', sequelize.fn('DATE', date)),
//         }
//       })

//       if(holiday){
//         await tables.Attendance.create({
//           class_id: student.class_id,
//           student_id: student.id,
//           date: date,
//           status: "HOLIDAY",
//         })

//       } else {
//         await tables.Attendance.create({
//           class_id: student.class_id,
//           student_id: student.id,
//           date: date,
//           status: "PENDING",
//         })
//       }
//     }

//   } catch (error) {
//     console.error("Error:", error.message);
//     console.log("cron scheduler error");
//   }

// });

// new Code
const { tables, sequelize } = require('../db/index.js');
const { Op } = require("sequelize");
const { findDatesBetween, isSunday } = require("../utils/common.js");
const cron = require("node-cron");
let date = new Date();

date.setUTCHours(0, 0, 0, 0);

cron.schedule("0 0 * * *", async () => {
  try {
    console.log(`Cron job started at ${new Date().toISOString()}`);
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    // Fetch all students
    const students = await tables.User.findAll({
      where: {
        role: "STUDENT",
        status: "ACTIVE"
      },
      raw: true
    });

    console.log(`${students.length} students fetched for cron scheduling`);

    // Check if today is Sunday
    const sunday = isSunday(currentDate);

    if (sunday) {
      const sundayDate = new Date();
      sundayDate.setDate(sundayDate.getDate() + 1);

      // Check if Sunday holiday is already created
      const existingHoliday = await tables.Holiday.findOne({
        where: {
          holiday_name: "sunday",
          date: sequelize.where(sequelize.fn('DATE', sequelize.col('date')), '=', sequelize.fn('DATE', sundayDate)),
        }
      });

      if (!existingHoliday) {
        await tables.Holiday.create({
          holiday_name: "sunday",
          date: sundayDate
        });
        console.log(`Sunday holiday created for ${sundayDate}`);
      } else {
        console.log("Sunday holiday already exists");
      }
    }

    // Process each student
    for (const student of students) {
      // Check if the holiday exists for the current date
      const holiday = await tables.Holiday.findOne({
        where: {
          date: sequelize.where(sequelize.fn('DATE', sequelize.col('date')), '=', sequelize.fn('DATE', currentDate)),
        }
      });

      // Check if attendance record already exists for the student on the current date
      const existingAttendance = await tables.Attendance.findOne({
        where: {
          student_id: student.id,
          date: sequelize.where(sequelize.fn('DATE', sequelize.col('date')), '=', sequelize.fn('DATE', currentDate)),
        }
      });

      if (!existingAttendance) {
        if (holiday) {
          await tables.Attendance.create({
            class_id: student.class_id,
            student_id: student.id,
            date: currentDate,
            status: "HOLIDAY",
          });
          console.log(`Holiday attendance recorded for student ${student.id} on ${currentDate}`);
        } else {
          await tables.Attendance.create({
            class_id: student.class_id,
            student_id: student.id,
            date: currentDate,
            status: "PENDING",
          });
          console.log(`Pending attendance recorded for student ${student.id} on ${currentDate}`);
        }
      } else {
        console.log(`Attendance already exists for student ${student.id} on ${currentDate}`);
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
    console.log("Cron scheduler error");
  }
});
