const { tables, sequelize } = require("../../db/index.js");
const { Op } = require("sequelize");
const error = require("../../error.js");
const asyncHandler = require("../../utils/asyncHandler.js");
const UserVal = require("../../validations/user/user.js");
const { TimeTable } = require("../../db/relationship.js");


exports.createTimeTable = asyncHandler(async (req, res) => {

    const { class_id, subject_id, start_time, end_time, period_no } = req.body;

    const teacherId = req.user.id;

    if (!class_id) throw error.VALIDATION_ERROR("Class id is required");

    if (!start_time) throw error.VALIDATION_ERROR("Start time is required");

    if (!end_time) throw error.VALIDATION_ERROR("End time is required");

    if (!period_no) throw error.VALIDATION_ERROR("Period no is required");

    if (!subject_id) throw error.VALIDATION_ERROR("Subject id is required");

    const period = await tables.TimeTable.findOne({ where: { class_id, period_no } });

    if (period) throw error.VALIDATION_ERROR("Period already exists");

    const timeTableData = {
        teacher_id: teacherId,
        ...req.body
    }

    await tables.TimeTable.create(timeTableData);

    return res.send({
        status: true,
        statusCode: 201,
        message: "Time table has created successfully."
    });

});

exports.getTimeTable = asyncHandler(async (req, res) => {

    const { class_id } = req.params;

    if (!class_id) throw error.VALIDATION_ERROR("Class id is required");

    const timeTable = await tables.TimeTable.findAll({
        where: { class_id },
        order: [['period_no', 'ASC']],
        attributes: ['id', 'period_no', 'start_time', 'end_time','teacher_id'],
        include: [
            {
                model: tables.Subject,
                attributes: ['id', 'subject_name'],
            },
            {
                model: tables.Class,
                attributes: ['id', 'class_name'],
            }
        ]
    });

    return res.send({
        status: true,
        message: "Time table fetched successfully",
        data: timeTable
    });
});

exports.deleteTimeTable = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) throw error.VALIDATION_ERROR("Time table id is required");
    
        const timeTable = await tables.TimeTable.findOne({ where: { id: id } });
    
        if (!timeTable) throw error.VALIDATION_ERROR("Time table not found");
    
        await TimeTable.destroy({ where: { id: id } });
        
        return res.send({
            status: true,
            status_code: 200,
            message: "Time table deleted successfully",
        })
    } catch (error) {
        console.log(error,'error');
    }
 
});


exports.updateTimeTable = asyncHandler(async (req, res) => {

    const { time_table_id, start_time, end_time } = req.body;

    if (!time_table_id) throw error.VALIDATION_ERROR("Time table id is required");

    if (!start_time) throw error.VALIDATION_ERROR("Start time is required");

    if (!end_time) throw error.VALIDATION_ERROR("End time is required");

    const timeTable = await tables.TimeTable.findOne({ where: { id: time_table_id } });

    if (!timeTable) throw error.VALIDATION_ERROR("Time table not found");

    await timeTable.update({
        start_time,
        end_time
    });

    return res.send({
        status: true,
        status_code: 201,
        message: "Time table updated successfully",
    })
});



exports. addHomework = asyncHandler(async (req, res) => {

    const body = req.body;

    const { date, class_id, subject_id, file_url } = body;

    const teacherId = req.user.id;

    if (!class_id) throw error.VALIDATION_ERROR("Class id is required");

    if (!subject_id) throw error.VALIDATION_ERROR("Subject id is required");

    if (!file_url) throw error.VALIDATION_ERROR("File url is required");

    const book = await tables.Book.findOne({ where: { subject_id, class_id }, raw: true });

    if (!book) throw error.VALIDATION_ERROR("Book not found");

    const bookId = book.id;

    const homeworkData = {
        teacher_id: teacherId,
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

    const body = req.query;

    const { homework_id } = body;

    const teacherId = req.user.id;

    if (!homework_id) throw error.VALIDATION_ERROR("Homework id is required");

    const homework = await tables.Homework.findOne({ where: { id: homework_id, teacher_id: teacherId } });

    if (!homework) throw error.VALIDATION_ERROR("Homework not found");

    await tables.Homework.destroy({ where: { id: homework_id } });

    return res.send({
        status: true,
        statusCode: 201,
        message: "Homework has removed successfully."
    });

});


exports.updateHomework = asyncHandler(async (req, res) => {

    const body = req.body;

    const { homework_id, class_id, subject_name, file_url, date, description } = body;

    const teacherId = req.user.id;
    
    if (!homework_id) throw error.VALIDATION_ERROR("Homework id is required");
    
    const homework = await tables.Homework.findOne({ where: { id: homework_id, teacher_id: teacherId } });

    if (!homework) throw error.VALIDATION_ERROR("Homework not found");
    
    await tables.Homework.update(body, { where: { id: homework_id } });
    
    await homework.save(
        {
            class_id,
            subject_name,
            file_url,
            date,
            description
        }
    )
    
    return res.send({
        status: true,
        statusCode: 201,
        message: "Homework has updated successfully."
    });
});

exports.getHomework = asyncHandler(async (req, res) => {

        const { class_id } = req.params;
        
    if (!class_id) throw error.VALIDATION_ERROR("Class id is required");
    
    
    const homework = await tables.Homework.findAll({
        where: {
            class_id: class_id,
        },
        attributes: ['id', 'file_url','date'],
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


    return res.send({
        status: true,
        statusCode: 200,
        message: "Homework fetched successfully.",
        data: homework
    })
    

});


exports.createTest = asyncHandler(async (req, res) => {
    
    const body = req.body;
    
    const { date, class_id, subject_id, test_file_url } = body;
    
    const teacherId = req.user.id;
    
    if (!test_file_url) throw error.VALIDATION_ERROR("Test file url is required");
    
    if (!class_id) throw error.VALIDATION_ERROR("Class id is required");
    
    if (!subject_id) throw error.VALIDATION_ERROR("Subject id is required");
    
    const book = await tables.Book.findOne({ where: { subject_id, class_id }, raw: true });

    if (!book) throw error.VALIDATION_ERROR("Book not found");
    
    const testData = {
        teacher_id: teacherId,
        book_id: book.id,
        ...body,
        class_id
    }
    
    if (date) testData.date = new Date(date);
    
    await tables.Test.create(testData);
    
    return res.send({
        status: true,
        statusCode: 201,
        message: "Test has created successfully."
    });
});


exports.removeTest = asyncHandler(async (req, res) => {

    // old code

    // const body = req.query;

    // const { test_id } = body;

    // const teacherId = req.user.id;
    

    // if (!test_id) throw error.VALIDATION_ERROR("Homework id is required");

    // const test = await tables.Test.findOne({ where: { id: test_id, teacher_id: teacherId } });

    // if (!test) throw error.VALIDATION_ERROR("Test not found");

    // await tables.Test.destroy({ where: { id: test_id } });

    // return res.send({
    //     status: true,
    //     statusCode: 201,
    //     message: "Test has removed successfully."
    // });

    const { id } = req.params;
    console.log(id,'deleted the data');    

    if (!id) throw error.VALIDATION_ERROR("valid test id is required");

    const test = await tables.Test.findOne({ where: { id: id } });

    if (!test) throw error.VALIDATION_ERROR("Test not found");

    await tables.Test.destroy({ where: { id: id } });

    return res.send({
        status: true,
        statusCode: 201,
        message: "Test has removed successfully."
    });


});

exports.getTests = asyncHandler(async (req, res) => {

    const { class_id } = req.params;

    if (!class_id) throw error.VALIDATION_ERROR("Class id is required");

    const data = await tables.Test.findAll({
        where: {
            class_id : class_id
        },
        attributes: ['id', 'test_file_url', 'date'],
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


    return res.send({
        status: true,
        statusCode: 200,
        message: "Test fetched successfully.",
        data: data
    })
});


//attendance
exports.createAttendance = asyncHandler(async (req, res) => {

    const body = req.body;

    const { class_id, student_id, is_present, date } = body;
    
    const teacherId = req.user.id;
    
    if (!class_id) throw error.VALIDATION_ERROR("Class id is required");
    
    if (!student_id) throw error.VALIDATION_ERROR("Student id is required");
    
    const student = await tables.User.findOne({ where: { id: student_id, role: "STUDENT", status: "ACTIVE" } });

    if (!student) throw error.VALIDATION_ERROR("Student not found");

    const classTeacher = await tables.ClassTeacher.findOne({ where: { class_id, teacher_id: teacherId, is_class_teacher: true } });

    if (!classTeacher) throw error.VALIDATION_ERROR("You are not a class teacher");

    const existingAttendance = await tables.Attendance.findOne({
        where: {
            class_id,
            student_id,
            date: sequelize.where(sequelize.fn('DATE', sequelize.col('date')), '=', sequelize.fn('DATE', date)),
        }
    });

    if (existingAttendance.dataValues.is_present !== is_present) {

        await tables.Attendance.update({ is_present: is_present }, { where: { id: existingAttendance.dataValues.id } });

        return res.send({ status: true, statusCode: 201, message: "Attendance marked successfully" });
    }

    if (existingAttendance) throw error.VALIDATION_ERROR('Attendance already marked for this student and class on the same day');

    const attendanceData = {
        class_id,
        teacher_id: teacherId,
        date,
        student_id,
        is_present: true
    }

    await tables.Attendance.create(attendanceData);

    return res.send({ status: true, statusCode: 201, message: "Attendance marked successfully" });

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
})


exports.getAttendance = asyncHandler(async (req, res) => {

    const teacherId = req.user.id;

    let currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    const classTeacher = await tables.ClassTeacher.findOne({
        where: { teacher_id: teacherId, is_class_teacher: true },
        raw: true,
    });


    if (!classTeacher) throw error.VALIDATION_ERROR("You are not class teacher for this class");

    const classId = classTeacher.class_id;

    const attendances = await tables.Attendance.findAll({
        where: {
            class_id: classId,
            status: ['ABSENT', 'PRESENT', 'PENDING'],
            date: currentDate
        },
        include: {
            model: tables.User,
            attributes: ['id', 'first_name', 'last_name', 'profile_url']
        }
    });

    return res.send({ status: true, statusCode: 200, attendances });

});




//Book management

exports.createBook = asyncHandler(async (req, res) => {

    const body = req.body;

    const { subject_id, class_id, cover_image_url, file_url } = body;
    
    if (!subject_id) throw error.VALIDATION_ERROR("Subject id is required");

    if (!class_id) throw error.VALIDATION_ERROR("Class id is required");

    if (!cover_image_url) throw error.VALIDATION_ERROR("Cover image url is required");

    if (!file_url) throw error.VALIDATION_ERROR("File url is required");

    const findClass = await tables.Class.findOne({ where: { id: class_id } });

    if (!findClass) throw error.VALIDATION_ERROR("Class not found");

    const subject = await tables.Subject.findOne({ where: { id: subject_id } });

    if (!subject) throw error.VALIDATION_ERROR("Subject not found");

    const book = await tables.Book.create(body)

    return res.send({ status: true, message: "Book created successfully", book });

})


exports.removeBook = asyncHandler(async (req, res) => {
    const { book_id } = req.query;

    if (!book_id) {
        throw error.VALIDATION_ERROR("Book id is required");
    }

    const book = await tables.Book.findOne({
        where: { id: book_id }
    });

    if (!book) {
        throw error.VALIDATION_ERROR("Book not found");
    }

    await tables.Book.destroy({
        where: { id: book_id }
    });

    return res.status(200).send({ status: true, message: "Book deleted successfully" });
});


exports.updateBook = asyncHandler(async (req, res) => {

    const { title, subject_name, book_id, description, cover_image_url } = req.body;

    if (!book_id) {
        throw error.VALIDATION_ERROR("Book id is required");
    }

    const book = await tables.Book.findOne({
        where: { id: book_id }
    });

    if (!book) {
        throw error.VALIDATION_ERROR("Book not found");
    }

    book.update(req.body);

    return res.status(200).send({ status: true, message: "Book updated successfully" });
});


exports.updateBook = asyncHandler(async (req, res) => {

    const { title, subject_name, book_id, description, cover_image_url } = req.body;

    if (!book_id) {
        throw error.VALIDATION_ERROR("Book id is required");
    }

    const book = await tables.Book.findOne({
        where: { id: book_id }
    });

    if (!book) {
        throw error.VALIDATION_ERROR("Book not found");
    }

    book.update(req.body);

    return res.status(200).send({ status: true, message: "Book updated successfully" });
});

exports.addChapter = asyncHandler(async (req, res) => {

    const body = req.body;

    const { book_id, title, chapter_no, content, description } = body;

    if (!book_id) throw error.VALIDATION_ERROR("Book id is required");

    if (!title) throw error.VALIDATION_ERROR("Title is required");

    if (!description) throw error.VALIDATION_ERROR("Description is required");

    if (!content) throw error.VALIDATION_ERROR("Content is required");

    if (!chapter_no) throw error.VALIDATION_ERROR("Chapter no is required");

    const book = await tables.Book.findOne({
        where: { id: book_id }
    });

    if (!book) throw error.VALIDATION_ERROR("Book not found");

    const chapter = await tables.Chapter.findOne({ where: { book_id: book_id, chapter_no: chapter_no } });

    if (chapter) throw error.VALIDATION_ERROR("Chapter already exists");

    await tables.Chapter.create(body);

    return res.send({ status: true, statusCode: 201, message: "Chapter added successfully" });
});


exports.getAllBooks = asyncHandler(async (req, res) => {

    const { class_id } = req.params;

    if (!class_id) throw error.VALIDATION_ERROR("Class id is required");

    const books = await tables.Book.findAll({
        where: { class_id },
        attributes: { exclude: ['created_at', 'updated_at'] },
        include: [
            {
                model: tables.Class,
                attributes: { exclude: ['created_at', 'updated_at'] }
            },
            {
                model: tables.Subject,
                attributes: { exclude: ['created_at', 'updated_at'] }
            }
        ]
    });

    return res.send({ status: true, statusCode: 200, data: books });
});




