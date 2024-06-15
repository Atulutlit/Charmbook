const { tables } = require("../../db/index.js");
const { Class, User, ClassTeacher } = tables;
const { Op } = require("sequelize");
const error = require("../../error.js");
const asyncHandler = require("../../utils/asyncHandler.js");


exports.createClassTeacher = asyncHandler(async (req, res) => {

    const { class_id, teacher_id } = req.body;

    if (!class_id) {
        throw error.VALIDATION_ERROR("Class id is required");
    }

    if (!teacher_id) {
        throw error.VALIDATION_ERROR("Teacher id is required");
    }

    const checkClass = await Class.findOne({ where: { id: class_id } });

    if (!checkClass) {
        throw error.VALIDATION_ERROR("Class not found");
    }

    const checkTeacher = await User.findOne({ where: { id: teacher_id, role: "TEACHER", status: "ACTIVE" } });

    if (!checkTeacher) {
        throw error.VALIDATION_ERROR("Teacher not found or is not active");
    }

    const existingClassTeacher = await ClassTeacher.findOne({
        where: { class_id, is_class_teacher: true }
    });

    if (existingClassTeacher) {
        throw error.VALIDATION_ERROR("Class teacher already exists");
    }

    await ClassTeacher.create({ class_id, teacher_id, is_class_teacher: true });

    return res.status(201).json({
        status: true,
        message: "Class teacher has been created successfully."
    });
});


exports.removeClassTeacher = asyncHandler(async (req, res) => {

    const { class_id, teacher_id } = req.body;

    if (!class_id) {
        throw error.VALIDATION_ERROR("Class id is required");
    }
    if (!teacher_id) {
        throw error.VALIDATION_ERROR("Teacher id is required");
    }

    const existingClassTeacher = await ClassTeacher.findOne({
        where: { class_id, teacher_id, is_class_teacher: true }
    });

    if (!existingClassTeacher) {
        throw error.VALIDATION_ERROR("Class teacher not found");
    }

    await ClassTeacher.destroy({ where: { class_id, teacher_id, is_class_teacher: true } });

    return res.status(201).json({
        status: true,
        message: "Class teacher has been removed successfully."
    });

});


exports.getTeachers = asyncHandler(async (req, res) => {
   
    const teachers = await User.findAll({
        where: { role: "TEACHER", status: "ACTIVE" },
        //  below line comment for now 
        // attributes: ["id", "first_name", "last_name", "email"],
    });

    return res.send({ status: true, statusCode: 200, message: "Teachers fetched successfully.", data: teachers });

});
exports.getStudents = asyncHandler(async (req, res) => {

    const students = await User.findAll({
        where: { role: "STUDENT", status: "ACTIVE" },
    });

    return res.send({ status: true, statusCode: 200, message: "Students fetched successfully.", data: students });
});