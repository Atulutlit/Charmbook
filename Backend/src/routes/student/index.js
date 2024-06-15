const {userAuthMiddleware} = require('../../middlewares/auth.middleware');
const studentController = require('../../controllers/student/student');

const express = require("express");
const router = express.Router();


router.get("/timetable",userAuthMiddleware, studentController.getTimeTable);
router.get("/homework",userAuthMiddleware, studentController.getHomework);
router.get("/attendance",userAuthMiddleware, studentController.getAttendance);
router.get("/book", userAuthMiddleware, studentController.getBooks);
router.get("/test", userAuthMiddleware, studentController.getMockTest);


module.exports = router;