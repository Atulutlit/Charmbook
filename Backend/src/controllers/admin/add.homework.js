const { tables } = require("../../db/index.js");
const { Op } = require("sequelize");
const error = require("../../error.js");
const asyncHandler = require("../../utils/asyncHandler.js");




//homework

exports.addHomework = asyncHandler(async (req, res) => {  
try {
    const body = req.body;

    const { date, class_id, subject_id, file_url, teacher_id } = body;
    
    // const teacherId = req.user.id;
    
    if (!class_id) throw error.VALIDATION_ERROR("Class id is required");

    if (!subject_id) throw error.VALIDATION_ERROR("Subject id is required");

    if (!file_url) throw error.VALIDATION_ERROR("File url is required");

    if(!teacher_id) throw error.VALIDATION_ERROR("Teacher id is required");

    const book = await tables.Book.findOne({ where: { subject_id, class_id }, raw: true });
    
        if (!book) throw error.VALIDATION_ERROR("Book not found");

    const bookId = book.id;

    const homeworkData = {
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

} catch (error) {
    return res.send({
        status: false,
        statusCode: 500,
        message: error
    });
}
    
});


exports.removeHomework = asyncHandler(async (req, res) => {

    const body = req.body;

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

exports.getHomework = asyncHandler(async (req, res) => {

    const body = req.body;

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