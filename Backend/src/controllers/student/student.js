const { tables, sequelize } = require("../../db/index.js");
const { Op } = require("sequelize");
const error = require("../../error.js");
const asyncHandler = require("../../utils/asyncHandler.js");


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
      book_id: classId,
    },
    attributes: ['id', 'title', 'test_file_url', 'description', 'date'],
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

  const data = {
    present_count: presentCount,
    absent_count: absentCount,
    present_percentage: presentPercentage.toFixed(2) + "%"
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

  const studentId = req.user.id;

  const user = await tables.User.findOne({
    where: { id: studentId },
    raw: true
  });

  const classId = user.class_id;

  const books = await tables.Book.findAll({
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

  return res.send({ status: true, statusCode: 200, message: "Books has fetched successfully.", data: books });

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
