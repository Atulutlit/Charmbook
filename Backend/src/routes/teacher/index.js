const { userAuthMiddleware } = require('../../middlewares/auth.middleware')
const teacherController = require('../../controllers/teacher/teacher');
const adminController = require('../../controllers/admin/admin');
const express = require("express");
const router = express.Router();


//time table
router.post("/timetable",userAuthMiddleware, teacherController.createTimeTable);
router.get("/timetable/:class_id",userAuthMiddleware, teacherController.getTimeTable);
router.patch("/timetable",userAuthMiddleware, teacherController.updateTimeTable);
router.delete("/timetable/:id",userAuthMiddleware, teacherController.deleteTimeTable);


router.post("/add/homework",userAuthMiddleware, teacherController.addHomework);
router.delete("/homework",userAuthMiddleware, teacherController.removeHomework);
router.put("/update/homework",userAuthMiddleware, teacherController.updateHomework);
router.get("/homeworks/:class_id",userAuthMiddleware, teacherController.getHomework);


//attendance
router.post("/attendance", userAuthMiddleware, teacherController.markAttendance);
router.get("/attendance", userAuthMiddleware, teacherController.getAttendance);


//book managemnet
router.get("/subject", userAuthMiddleware, adminController.getSubject);
router.post("/add/book", userAuthMiddleware, teacherController.createBook);
router.delete("/book", userAuthMiddleware, teacherController.removeBook);
router.put("/update/book", userAuthMiddleware, teacherController.updateBook);
router.post("/add/chapter", userAuthMiddleware, teacherController.addChapter);
router.get("/books/:class_id", userAuthMiddleware, teacherController.getAllBooks);


//Test
router.post("/add/test", userAuthMiddleware, teacherController.createTest);
router.delete("/test",userAuthMiddleware, teacherController.removeTest);
router.get("/tests/:class_id",userAuthMiddleware, teacherController.getTests);


// get terms and condition api
router.get("/terms/condition", teacherController.termsAndCondition);

// get privacy policy
router.get("/privacy", teacherController.privacy);

// about us
router.get("/about", teacherController.aboutUs)


// notification
router.get('/notification/:id', teacherController.getNotification);
router.post('/notification', teacherController.createNotification);



module.exports = router;