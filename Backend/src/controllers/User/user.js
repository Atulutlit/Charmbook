const { tables } = require("../../db/index.js");
const { sendOtp, createToken } = require("../../utils/common.js");
const { Op, where } = require("sequelize");
const bcrypt = require("bcryptjs");
const UserVal = require("../../validations/user/user.js");
const error = require("../../error.js");
const asyncHandler = require("../../utils/asyncHandler.js");
const moment = require('moment');
const { messaging } = require("firebase-admin");


exports.login = asyncHandler(async (req, res) => {

  const body = req.body;

  const { password, enrollment_no, fcm_token } = body;

  if(!enrollment_no) throw error.ERROR("Enrollment number is required",200);

  if(!fcm_token) throw error.VALIDATION_ERROR("FCM token is required");

  if (!password) throw error.VALIDATION_ERROR("Password is required");

   const user = await tables.User.findOne({
      where: { enrollment_no: enrollment_no, status: "ACTIVE" },
      include: [
        {
          model: tables.Class,
        }
      ],
      attributes: { exclude: ['created_at', 'updated_at'] },
      raw: true,
      nest: true
    });

    if (!user) throw error.ERROR("No user found with the provided enrollment number.",200);

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) throw error.ERROR("Login failed!",200);

  await tables.Fcm_token.upsert({ fcm_token, user_id: user.id, created_at: Date.now(), updated_at: Date.now() }, { where: { user_id: user.id } });

  const token = await createToken(user);

  await tables.User.update({
    token: token
  }, {
    where: { id: user.id }
  })


  user.token = token;

  delete user.password;

  return res.send({ status: true, statusCode: 200, message: "User login Successfully", user });

});


exports.getAllClass = asyncHandler(async (req, res) => {

  const classes = await tables.Class.findAll({
    attributes: ['id', 'class_name'],
  });

  return res.send({
    status: true,
    statusCode: 200,
    message: "Classes fetched successfully",
    classes
  })
});


exports.getAllSubject = asyncHandler(async (req, res) => {

  const subjects = await tables.Subject.findAll();

  return res.send({
    status: true,
    statusCode: 200,
    message: "Subjects fetched successfully",
    subjects
  })

});


// exports.logout = asyncHandler(async (req, res) => {

//   const userId = req.user.id;

//   const time = new Date();

//   const formattedTime = moment(time).format("HH:mm:ss");


//   const schedule = await tables.School_schedule.findOne({
//     raw: true
//   });

//   const startTime = schedule.start_time;
//   const endTime = schedule.end_time;

//   const logoutTime = new Date(`1970-01-01T${formattedTime}`);

//   const schoolStartTime = new Date(`1970-01-01T${startTime}`);
//   const schoolEndTime = new Date(`1970-01-01T${endTime}`);

//   if (logoutTime >= schoolStartTime && logoutTime <= schoolEndTime) {
//     // send notificaiton to class teacher and admin
//   } 

//   return res.send({
//     status: true,
//     statusCode: 200,
//     message: "User logged out successfully",
//   })

// });



exports.updateProfile = asyncHandler(async (req, res) => {

  const userId = req.user.id;

  const body = req.body;

  const { first_name, last_name, email, profile_url } = body;


  await tables.User.update({ first_name, last_name, email, profile_url }, { where: { id: userId }, raw: true });

  return res.send({ status: true, statusCode: 200, message: "Profile updated successfully" })

});

exports.getProfile = asyncHandler(async (req, res) => {

  const userId = req.user.id;

  const user = await tables.User.findOne({
    where: { id: userId },
    attributes: { exclude: ['created_at', 'updated_at', 'password'] },
    include: [
      {
        model: tables.Class,
      }
    ],
  })

  return res.send({
    status: true,
    statusCode: 200,
    message: "User profile",
    data: user
  })

});


exports.logout = asyncHandler(async (req, res) => {

  const userId = req.user.id;

  await tables.User.update({ token: null }, { where: { id: userId }, raw: true });

  try {
       // Find the student
       const student = await tables.User.findOne({ 
        where: { 
          id: userId,
          role: 'STUDENT' 
        }
      });
  
      if (!student) {
        return res.send({ status: true, statusCode: 200, message: "User logged out successfully" });
      }
  
      // Find the teacher of the same class
      const teacher = await tables.User.findOne({ 
        where: { 
          class_id: student.class_id,
          role: 'TEACHER' 
        }
      });
  
      if (!teacher) {
         return res.send({ status: true, statusCode: 200, message: "User logged out successfully" });
      }
  
      // Create the notification data
      const data = {
        type: 'Teacher to Student',
        title: 'Logout',
        message: `${student.first_name} logged out at ${new Date().toISOString()}`,
        sender_id: userId,
        receiver_id: teacher.id,
        receiver_type: 'Teacher',
        status: 'unread'
      };
  
      // Create the notification
      const notification = await tables.Notification.create(data);
  } catch (error) {
      console.log(error,'error')
  }
 
  return res.send({ status: true, statusCode: 200, message: "User logged out successfully" });

});


exports.normal = asyncHandler(async (req, res) => {
  // User ID of the student who logged out
  const userId = 1;

  try {
    // Find the student
    const student = await tables.User.findOne({ 
      where: { 
        id: userId,
        role: 'STUDENT' 
      }
    });

    if (!student) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: 'Student not found'
      });
    }

    // Find the teacher of the same class
    const teacher = await tables.User.findOne({ 
      where: { 
        class_id: student.class_id,
        role: 'TEACHER' 
      }
    });

    if (!teacher) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: 'Teacher not found'
      });
    }

    // Create the notification data
    const data = {
      type: 'Teacher to Student',
      title: 'Logout',
      message: `${student.first_name} logged out at ${new Date().toISOString()}`,
      sender_id: userId,
      receiver_id: teacher.id,
      receiver_type: 'Teacher',
      status: 'unread'
    };

    // Create the notification
    const notification = await tables.Notification.create(data);
    console.log(notification, 'notification');

    return res.status(201).json({
      status: true,
      statusCode: 201,
      message: 'Notification created successfully',
      data: notification
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: 'Failed to create notification. Please try again later.'
    });
  }
});