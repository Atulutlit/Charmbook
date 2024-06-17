const { tables, sequelize } = require("../../db/index.js");
const { Op } = require("sequelize");
const { sendOtp, findDatesBetween, createToken, generateEnrollmentNumber } = require("../../utils/common.js");
const UserVal = require("../../validations/user/user.js");
const error = require("../../error.js");
const asyncHandler = require("../../utils/asyncHandler.js");
const bcrypt = require("bcryptjs");
const moment = require('moment');
const User = require('./../../db/models/user.js');
const { Subject } = require("../../db/relationship.js");
// const uuid = require('uuid');

// const { nanoid } = require("nanoid");


exports.login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email) throw error.VALIDATION_ERROR("Email is required");

    if (!password) throw error.VALIDATION_ERROR("Password is required");

    const admin = await tables.Admin.findOne({
        where: { email },
        attributes: { exclude: ['created_at', 'updated_at'] }
    });

    if (!admin) throw error.VALIDATION_ERROR("Login failed! No admin found");

    const adminPassword = admin.dataValues.password;

    // const isValidPassword = await bcrypt.compare(password, adminPassword)
    
    // if (!isValidPassword) throw error.AUTH_ERROR("Login failed!");

    const token = await createToken(admin.dataValues);

    admin.update({
        token: token
    })

    delete admin.dataValues.password;

    return res.send({ status: true, statusCode: 200, message: "Admin login Successfully", admin });

});


exports.createUser = asyncHandler(async (req, res) => {

    const body = req.body;
    let { email, phone_no, password, confirm_password, role, class_id } = body;

    const { User } = tables;

    const valSchema = new UserVal().getRegisterVS();
    const { error: errorVal } = valSchema.validate(body);

    if (errorVal) throw error.VALIDATION_ERROR(errorVal.message);

    const enrollmentNo = generateEnrollmentNumber();

    if (password !== confirm_password) throw error.VALIDATION_ERROR("Password and confirm password does not match");

    
    if (role === "TEACHER") {
        
        if (!phone_no) throw error.VALIDATION_ERROR("Phone number is required");
        if (!email) throw error.VALIDATION_ERROR("Email is required");

        const checkEmail = await User.findOne({ where: { email: email } });

        if (checkEmail) throw error.VALIDATION_ERROR("Email already exists");

        const checkPhone = await User.findOne({ where: { phone_no: phone_no } });

        if (checkPhone) throw error.VALIDATION_ERROR("Phone number already exists");
    }

    
    if (role === "STUDENT") {
        
        if (!class_id) throw error.VALIDATION_ERROR("Class id is required");
        
        const checkClass = await tables.Class.findOne({ where: { id: class_id } });
        
        if (!checkClass) throw error.VALIDATION_ERROR("Class not found");
    }
    
    const newUser = {
        ...body,
        enrollment_no: enrollmentNo
    };
    
    newUser.password = await bcrypt.hash(password, 10);
    
    await User.create(newUser);

    return res.send({ status: true, statusCode: 201, message: `${role} has created successfully.` });

});



exports.createClass = asyncHandler(async (req, res) => {

    const body = req.body;

    const { class_name } = body;
    
    if (!class_name) throw error.VALIDATION_ERROR("Class name is required");

    const data = await tables.Class.findOne({ where: { class_name: class_name } });

    if (data) throw error.VALIDATION_ERROR("Class already exists");

    await tables.Class.create(body);

    return res.send({ status: true, statusCode: 201, message: "Class has created successfully." });
});

exports.deleteClass = asyncHandler(async (req,res)=>{
    const { id } = req.params;

    if (!id) throw error.VALIDATION_ERROR("Class id is required");

    await tables.Class.destroy({ where: { id: id} });

    return res.send({ status: true, statusCode: 200, message: "Class has deleted successfully." });
})

// required to check the logic
exports.updateClass = asyncHandler(async (req,res)=>{
    try {
        const { name,id } = req.body;
        let class_name=name;
        if (!id) throw error.VALIDATION_ERROR("Class id is required");
            
        
        try {
            const data = await tables.Class.findOne({ where: { id: id } });
            console.log(data,'data')
            if (!data) throw error.VALIDATION_ERROR("Class not found");
            await Class.update({
                class_name
            })
        } catch (error) {
            console.log(error,'error')
        }
       
    
        return res.send({ status: true, statusCode: 200, message: "Class updated successfully" }); 
    } catch (error) {
        console.log(error,'error')
    }
    

})


exports.createSchoolSchedule = asyncHandler(async (req, res) => {
    
    const body = req.body;

    const { start_time, end_time } = body;
    
    if (!start_time) throw error.VALIDATION_ERROR("Start time is required");

    if (!end_time) throw error.VALIDATION_ERROR("End time is required");

    const schedule = await tables.School_schedule.findOne();
    
    if (schedule) {

        await schedule.update(
            {
                start_time: start_time,
                end_time: end_time
            }
        )

    } else {
        await tables.School_schedule.create({ start_time: start_time, end_time: end_time });
    }

    return res.send({ status: true, statusCode: 201, message: "Schedule has created successfully." });

})

exports.fetchSchedule= asyncHandler(async (req,res) => {
   
    const data = await tables.School_schedule.findOne();
    
    return res.send({ status: true, statusCode: 200, data:data, message: "Schedule has created successfully." });
})


exports.createSubject = asyncHandler(async (req, res) => {

    const body = req.body;

    const { subject_name } = body;

    if (!subject_name) throw error.VALIDATION_ERROR("Subject name is required");

    const data = await tables.Subject.findOne({ where: { subject_name: subject_name } });

    if (data) throw error.VALIDATION_ERROR("Subject already exists");

    await tables.Subject.create(body);

    return res.send({ status: true, statusCode: 201, message: "Subject has created successfully." });
})

exports.updateSubject = asyncHandler(async (req,res)=>{
    try {
        const { id } = req.params; // Extract 'id' from request parameters
        const { subject_name } = req.body; // Extract 'subject_name' from request body
    
        // Check if the subject exists
        const data = await tables.Subject.findOne({
            where: { id }
        });
        console.log(data,'data')
        if (!data) {
            return res.status(500).send({ status: false, message: error.message });
            // Throw an error if the subject does not exist
        }

    
        // Update the subject
        await tables.Subject.update(
            { subject_name }, // Updated values
            { where: { id } } // Where clause
        );
    
        // Send a successful response
        return res.status(200).send({ status: true, message: "Subject updated successfully" });
    } catch (error) {
        console.error(error); // Log the error
        // Send an error response
        return res.status(500).send({ status: false, message: error.message });
    }    
    
})
exports.getUsersCount = asyncHandler(async (req, res) => {

    const studentCount = await tables.User.count({ where: { role: 'STUDENT' } });
    const teacherCount = await tables.User.count({ where: { role: 'TEACHER' } });

    const totalUser = studentCount + teacherCount;

    return res.send({
        status: true,
        statusCode: 200,
        data: {
            student_count: studentCount,
            teacher_count: teacherCount,
            total_user: totalUser
        }
    });
});
exports.getClass = asyncHandler(async (req, res) => {

    const data = await tables.Class.findAll({

        attributes: { exclude: ['created_at', 'updated_at'] }
    });

    return res.send({ status: true, statusCode: 200, data });
});


exports.getSubject = asyncHandler(async (req, res) => {

    const data = await tables.Subject.findAll({

        attributes: { exclude: ['created_at', 'updated_at'] }
    });

    return res.send({ status: true, statusCode: 200, data });
})

exports.removeStudent = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!id) throw error.VALIDATION_ERROR("Subject id is required");

    await tables.User.destroy({ where: { id: id ,role :"STUDENT"} });

    return res.send({ status: true, statusCode: 200, message: "Student has deleted successfully." });

})

exports.removeTeacher = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!id) throw error.VALIDATION_ERROR("Subject id is required");

    await tables.User.destroy({ where: { id: id ,role :"TEACHER"} });

    return res.send({ status: true, statusCode: 200, message: "Teacher has deleted successfully." });

})

exports.deleteSubject = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!id) throw error.VALIDATION_ERROR("Subject id is required");

    await tables.Subject.destroy({ where: { id: id } });

    return res.send({ status: true, statusCode: 200, message: "Subject has deleted successfully." });

})


exports.createHoliday = asyncHandler(async (req, res) => {
    const { start_date, end_date, holiday_name } = req.body;

    if (!start_date) throw error.VALIDATION_ERROR("Start date is required");

    if (!end_date) throw error.VALIDATION_ERROR("End date is required");

    if (!holiday_name) throw error.VALIDATION_ERROR("Holiday name is required");
    const dates = await findDatesBetween(start_date, end_date);

    for (let i = 0; i < dates.length; i++) {

        await tables.Holiday.create({ date: dates[i], holiday_name: holiday_name });
    }

    return res.send({ status: true, statusCode: 201, message: "Holiday has created successfully." });

})

// holiday
exports.getHoliday = asyncHandler(async (req,res) => {
    const data = await tables.Holiday.findAll();
    console.log(data,'data holiday')
    return res.send({ status: true, statusCode: 200, data });
})

exports.updateHoliday = asyncHandler(async (req,res) => {
    const { startDate, endDate } = req.body;
    const {id}=req.params;
    console.log(startDate,endDate,id,'update Holiday')


    const data = await tables.Holiday.findOne({
        where: { id },
    });

    if (!data) throw error.VALIDATION_ERROR("There is no data.Please refresh it.");

    admin.update({
        token: token
    })

    delete admin.dataValues.password;

    return res.send({ status: true, statusCode: 200, message: "Admin login Successfully", admin });
})

exports.deleteHoliday = asyncHandler(async (req,res) => {
    const { id } = req.params;

    if (!id) throw error.VALIDATION_ERROR("Holiday id is required");

    await tables.Holiday.destroy({ where: { id: id} });

    return res.send({ status: true, statusCode: 200, message: "Holiday has deleted successfully." });
})

// attendance
exports.getAttendance = asyncHandler(async (req, res) => {

    const { date, class_id } = req.query;

    if (!class_id) throw error.VALIDATION_ERROR("Class id is required");

    if (!date) throw error.VALIDATION_ERROR("Date is required");


    const attendances = await tables.Attendance.findAll({
        where: {
            class_id: class_id,
            status: ['ABSENT', 'PRESENT', 'PENDING'],
            date: {
                [Op.between]: [`${date}T00:00:00Z`, `${date}T23:59:59Z`],
            }
        },
        include: {
            model: tables.User,
            attributes: ['id', 'first_name', 'last_name', 'profile_url']
        }
    });

    return res.send({ status: true, statusCode: 200, data: attendances });

});


exports.markAttendance = asyncHandler(async (req, res) => {

    const { attendance_id, status } = req.body;
    
    if (!attendance_id) throw error.VALIDATION_ERROR("Attendance id is required");
    
    if (!status) throw error.VALIDATION_ERROR("Attendance status is required");
    
    const attendance = await tables.Attendance.findOne({ where: { id: attendance_id } });
    
    if (!attendance) throw error.VALIDATION_ERROR("Attendance not found");

    await attendance.update({
        status
    })

    return res.send({ status: true, statusCode: 200, message: "Attendance marked successfully" });

});


// timetable

exports.createTimeTable = asyncHandler(async (req, res) => {

    const { class_id, subject_id, start_time, end_time, period_no, teacher_id } = req.body;

    if (!teacher_id) throw error.VALIDATION_ERROR("Teacher id is required");

    if (!class_id) throw error.VALIDATION_ERROR("Class id is required");

    if (!start_time) throw error.VALIDATION_ERROR("Start time is required");

    if (!end_time) throw error.VALIDATION_ERROR("End time is required");

    if (!period_no) throw error.VALIDATION_ERROR("Period no is required");

    if (!subject_id) throw error.VALIDATION_ERROR("Subject id is required");

    const period = await tables.TimeTable.findOne({ where: { class_id, period_no } });

    if (period) throw error.VALIDATION_ERROR("Period already exists");

    const timeTableData = {
        ...req.body
    }
    await tables.TimeTable.create(timeTableData);

    return res.send({
        status: true,
        statusCode: 201,
        message: "Time table has created successfully."
    });

});


exports.addHomework = asyncHandler(async (req, res) => {

    const body = req.body;

    const { date, class_id, subject_id, file_url, teacher_id } = body;


    if (!class_id) throw error.VALIDATION_ERROR("Class id is required");

    if (!subject_id) throw error.VALIDATION_ERROR("Subject id is required");

    if (!file_url) throw error.VALIDATION_ERROR("File url is required");

    const book = await tables.Book.findOne({ where: { subject_id, class_id }, raw: true });

    if (!book) throw error.VALIDATION_ERROR("Book not found");

    const bookId = book.id;

    const homeworkData = {
        teacher_id: teacher_id,
        book_id: bookId,
        ...body
    }

    if (date) homeworkData.date = new Date(date);

    await tables.Homework.create(homeworkData);

    return res.send({
        status: true,
        statusCode: 201,
        message: "Homework has created successfully."
    });

});


exports.removeHomework = asyncHandler(async (req, res) => {

    const { id: homework_id } = req.params;

    if (!homework_id) throw error.VALIDATION_ERROR("Homework id is required");

    const homework = await tables.Homework.findOne({ where: { id: homework_id} });

    if (!homework) throw error.VALIDATION_ERROR("Homework not found");

    await tables.Homework.destroy({ where: { id: homework_id } });

    return res.send({
        status: true,
        statusCode: 201,
        message: "Homework has removed successfully."
    });

});

//test

exports.createTest = asyncHandler(async (req, res) => {

    const body = req.body;

    const { date, class_id, subject_id, test_file_url, teacher_id } = body;

    if (!teacher_id) throw error.VALIDATION_ERROR("Teacher id is required");

    if (!test_file_url) throw error.VALIDATION_ERROR("Test file url is required");

    if (!class_id) throw error.VALIDATION_ERROR("Class id is required");

    if (!subject_id) throw error.VALIDATION_ERROR("Subject id is required");

    const book = await tables.Book.findOne({ where: { subject_id, class_id }, raw: true });

    if (!book) throw error.VALIDATION_ERROR("Book not found");

    const testData = {
        book_id: book.id,
        ...body
    }

    if (date) testData.date = new Date(date);

    await tables.Test.create(testData);

    return res.send({
        status: true,
        statusCode: 201,
        message: "Test has created successfully."
    });
});
