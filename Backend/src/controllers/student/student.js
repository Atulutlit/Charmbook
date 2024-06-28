const { tables, sequelize } = require("../../db/index.js");
const { Op } = require("sequelize");
const error = require("../../error.js");
const asyncHandler = require("../../utils/asyncHandler.js");
const logSchedulers = require("./../../../log.js")


exports.createTimeTable = asyncHandler(async (req, res) => {

  const body = req.body;

  let { email, phone_no, password, confirm_password } = body;

  const { User } = tables;

  const valSchema = new UserVal().getRegisterVS();
  const { error: errorVal } = valSchema.validate(body);

  if (errorVal) throw error.VALIDATION_ERROR(errorVal.message);

  if (password !== confirm_password) throw error.VALIDATION_ERROR("Password and confirm password does not match");

  let checkUser = await User.findOne({
    where: {
      [Op.or]: [
        { email: email },
      ]
    }
  });

  if (checkUser && checkUser.email_verified) throw error.VALIDATION_ERROR("User already exists");

  let user = checkUser;

  const hashedPassword = await bcrypt.hash(body.password, 10);

  body.password = hashedPassword;

  if (!checkUser) {
    user = await User.create(body);
  } else {
    await checkUser.update(
      body
    )
  }

  user.password = undefined;

  await sendOtp(user);

  return res.send({ status: true, statusCode: 201, message: "User has created successfully." });

});


exports.getHomework = asyncHandler(async (req, res) => {
  const classId = req.user.class_id;

  const homework = await tables.Homework.findAll({
    where: {
      class_id: classId,
    },
    attributes: ['id', 'title', 'file_url', 'description', 'date'],
    include: [
      {
        model: tables.Book,
        attributes: ['cover_image_url'],
        include: {
          model: tables.Subject,
          attributes: ['id', 'subject_name']
        }
      }
    ]
  });

  res.send({
    status: true,
    statusCode: 200,
    message: "Homework fetched successfully.",
    data: homework
  });
});


exports.getMockTest = asyncHandler(async (req, res) => {
  const classId = req.user.class_id;

  const test = await tables.Test.findAll({
            where: {
              class_id : classId
          },
          attributes: ['id', 'test_file_url', 'date','class_id','teacher_id'],
          include: [
              {
                  model: tables.Subject,
                  attributes: ['id', 'subject_name']
                  
              },
              {
                  model: tables.Class,
                  attributes: ['id', 'class_name']
                  
              },
              {
                  model: tables.User,
                  attributes: ['id', 'first_name','last_name']
                  
              }
          ]
  });

  res.send({
    status: true,
    statusCode: 200,
    message: "Test fetched successfully.",
    data: test
  });
});


exports.getAttendance = asyncHandler(async (req, res) => {
   
  const studentId = req.user.id;
  
  const { target_date } = req.query;

  if ( !target_date ) throw error.VALIDATION_ERROR("Target date is required");

  const utcStartDate = new Date(target_date).toISOString();

  const records = await tables.Attendance.findAll({
    where: {
      student_id: studentId,
      date: {
        [Op.gte]: utcStartDate,
        [Op.lt]: new Date(target_date).setMonth(new Date(utcStartDate).getMonth() + 1),
      }
    },
    raw: true
  });
  
  let presentCount = 0;
  let absentCount = 0;

  records.forEach(entry => {
    if (entry.status === "PRESENT") {
      presentCount++;
    } else if (entry.status === "ABSENT") {
      absentCount++;
    }
  });

  let totalCount = presentCount + absentCount;

  const presentPercentage = (presentCount / totalCount) * 100;

  // holiday count
  let holiday_count=0;
  try {
    const {target_date}=req.query;
     // Parse the provided date
     const [year, month] = target_date.split('-');
     const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
     const endDate = new Date(startDate);
     endDate.setMonth(endDate.getMonth() + 1);
 
     const posts = await tables.Holiday.findAll({
        date: {
         $gte: startDate,
         $lt: endDate
       }
     });
     holiday_count=posts.length;
  } catch (error) {
    console.log(error,'error');
  }

  const data = {
    present_count: presentCount,
    absent_count: absentCount,
    present_percentage: presentPercentage.toFixed(2) + "%",
    holiday_count : holiday_count  // count holiday for a given month remained(24/06/2024)
  };


  return res.send({
    status: true,
    statusCode: 200,
    message: "Attendance has fetched successfully.",
    data: records,
    extra_data: data

  });

   });


exports.getBooks = asyncHandler(async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Find the user
    const user = await tables.User.findOne({
      where: { id: studentId },
      raw: true
    });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found." });
    }

    const classId = user.class_id;


    // Fetch the timetable for the user's class
    const timeTable = await tables.TimeTable.findAll({
      where: { class_id: classId },
    });

        // Get current time in HH:MM:SS format
        const current_time = new Date();
        const currentHours = String(current_time.getHours()).padStart(2, '0');
        const currentMinutes = String(current_time.getMinutes()).padStart(2, '0');
        const currentSeconds = String(current_time.getSeconds()).padStart(2, '0');
        const currentTimeString = `${currentHours}:${currentMinutes}:${currentSeconds}`;
    
        let subjectId = null;
        
        // Compare current time with timetable entries
        for (let i = 0; i < timeTable.length; i++) {
          const startTime = timeTable[i].start_time;
          const endTime = timeTable[i].end_time;
          logSchedulers("get book",`${startTime} and ${endTime} and ${currentTimeString}`);
    
          console.log(startTime, 'start time', endTime, 'end time',currentTimeString);
          console.log(currentTimeString >= startTime && currentTimeString <= endTime);
    
          if (currentTimeString >= startTime && currentTimeString <= endTime) {
            subjectId = timeTable[i].subject_id;
            break;
          }
        }

    if (!subjectId) {
    // Fetch books for the determined subject
    const books = await tables.Book.findAll({
      attributes: { exclude: ['created_at', 'updated_at'] },
      include: [
        {
          model: tables.Subject,
          attributes: { exclude: ['created_at', 'updated_at'] }
        },
        {
          model: tables.Class,
          attributes: { exclude: ['created_at', 'updated_at'] }
        }
      ]
    });

    return res.json({ status: true, statusCode: 200, message: "Books fetched successfully.", data: books });

  }

    // Fetch books for the determined subject
    const books = await tables.Book.findAll({
      where: { class_id: classId, subject_id: subjectId },
      attributes: { exclude: ['created_at', 'updated_at'] },
      include: [
        {
          model: tables.Subject,
          attributes: { exclude: ['created_at', 'updated_at'] }
        },
        {
          model: tables.Class,
          attributes: { exclude: ['created_at', 'updated_at'] }
        }
      ]
    });

    return res.json({ status: true, statusCode: 200, message: "Books fetched successfully.", data: books });

  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
});



exports.getTimeTable = asyncHandler(async (req, res) => {

  const classId = req.user.class_id;

  const timeTable = await tables.TimeTable.findAll({
    order: [['period_no', 'ASC']],
    where: { class_id: classId },
    attributes: { exclude: ['created_at', 'updated_at'] },
    include: [
      {
        model: tables.Subject,
        attributes: { exclude: ['created_at', 'updated_at'] }
      },
      {
        model: tables.Class,
        attributes: { exclude: ['created_at', 'updated_at'] }
      }
    ]
  });

  return res.send({ status: true, statusCode: 200, message: "Time table has fetched successfully.", data: timeTable });

});


// Fetch notifications
exports.getNotification = asyncHandler(async (req, res) => {
  const { id } = req.params; // Using `req.params` for path variables or `req.query` if passed as a query parameter

  const notifications = await tables.Notification.findAll({
    where: { receiver_id: id },
  });

  return res.status(200).json({ 
    status: true, 
    statusCode: 200, 
    message: "Notifications fetched successfully.", 
    data: notifications 
  });
});
