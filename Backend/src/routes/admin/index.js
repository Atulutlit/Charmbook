const { adminAuthMiddleware } = require('../../middlewares/auth.middleware');
const adminController = require('../../controllers/admin/admin');
const adminHomeworkController = require('../../controllers/admin/add.homework');
const adminTeacherController = require('../../controllers/admin/admin.teacher');
const teacherController = require('../../controllers/teacher/teacher');
const { uploadImagesS3, uploadDocumentsS3} = require("../../utils/s3BucketHelper");
const {
    uploadMultipleImage,
    uploadImage,
    uploadMultipleVideo,
    uploadVideo,
    uploadMultipleDocuments,
    uploadDocuments,
    deleteFile
  } = require("../../controllers/file/fileHandler.js");
  
const express = require("express");
const router = express.Router();


router.post("/login", adminController.login);
router.post("/user/create", adminAuthMiddleware, adminController.createUser);
router.post("/subject", adminAuthMiddleware, adminController.createSubject);
router.get("/users/count", adminAuthMiddleware, adminController.getUsersCount);

router.get("/class", adminAuthMiddleware, adminController.getClass); 
router.post("/class/create", adminAuthMiddleware, adminController.createClass);
// @Atul delete and update class(pending to create it);
router.delete("/class/:id",adminAuthMiddleware,adminController.deleteClass)
router.put("/class/:id",adminAuthMiddleware,adminController.updateClass)

//teacher
router.get("/teachers", adminAuthMiddleware, adminTeacherController.getTeachers);
router.get("/students", adminAuthMiddleware, adminTeacherController.getStudents);
router.post("/class/teacher/create", adminAuthMiddleware, adminTeacherController.createClassTeacher);
router.put("/class/teacher/remove", adminAuthMiddleware, adminTeacherController.removeClassTeacher);

// create schedule and get schedule
router.post("/school/schedule/create", adminAuthMiddleware, adminController.createSchoolSchedule);
router.get("/school/schedule", adminAuthMiddleware, adminController.fetchSchedule);

// get and delete subject
router.get("/subject", adminAuthMiddleware, adminController.getSubject);
router.delete("/subject/:id", adminAuthMiddleware, adminController.deleteSubject);
// @Atul 12/06/2024 
router.put("/subject/:id",adminAuthMiddleware,adminController.updateSubject);


// @Atul created 12/06/2024
// For Remove Student
router.delete('/student/:id',adminAuthMiddleware,adminController.removeStudent);  
// For Remove teacher
router.delete('/teacher/:id',adminAuthMiddleware,adminController.removeTeacher);  

// update detail of student and teacher
router.put('/user/:id',adminAuthMiddleware,adminController.updateUser);

// holidays
router.post("/holidays", adminAuthMiddleware, adminController.createHoliday);
router.get("/holidays", adminAuthMiddleware, adminController.getHoliday)
router.delete("/holidays/:id", adminAuthMiddleware, adminController.deleteHoliday);
router.put("holidays/:id", adminAuthMiddleware, adminController.updateHoliday)


// homework
router.post("/homework", adminAuthMiddleware, adminHomeworkController.addHomework);
router.get ("/homework/:class_id", adminAuthMiddleware, adminHomeworkController.getHomework);


//Attendance
router.get("/attendance", adminAuthMiddleware, adminController.getAttendance);
router.post("/mark/attendance", adminAuthMiddleware, adminController.markAttendance);


//timetable
router.post("/timetable", adminAuthMiddleware, adminController.createTimeTable);
router.get("/timetable/:class_id",adminAuthMiddleware, teacherController.getTimeTable);
router.patch("/timetable",adminAuthMiddleware, teacherController.updateTimeTable);
router.delete("/timetable/:id",adminAuthMiddleware, teacherController.deleteTimeTable);


//homework
router.post("/add/homework",adminAuthMiddleware, adminController.addHomework);
router.delete("/homework/:id",adminAuthMiddleware, adminController.removeHomework);
router.put("/update/homework",adminAuthMiddleware, teacherController.updateHomework);
router.get("/homeworks/:class_id",adminAuthMiddleware, teacherController.getHomework);


//test
router.post("/add/test", adminAuthMiddleware, adminController.createTest);
router.delete("/test/:id",adminAuthMiddleware, teacherController.removeTest);
router.get("/tests/:class_id",adminAuthMiddleware, teacherController.getTests);


//book
router.get("/subject", adminAuthMiddleware, adminController.getSubject);
router.post("/add/book", adminAuthMiddleware, teacherController.createBook);
router.delete("/book/", adminAuthMiddleware, teacherController.removeBook);
router.put("/update/book", adminAuthMiddleware, teacherController.updateBook);
router.post("/add/chapter", adminAuthMiddleware, teacherController.addChapter);
router.get("/books/:class_id", adminAuthMiddleware, teacherController.getAllBooks);


//file upload
router.post("/image", adminAuthMiddleware, uploadImagesS3.single('image'), uploadImage);
router.post("/doc", adminAuthMiddleware, uploadDocumentsS3.single('doc'), uploadDocuments);
router.post("/file/delete", adminAuthMiddleware, deleteFile);


module.exports = router;