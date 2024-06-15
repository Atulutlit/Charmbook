const {userAuthMiddleware} = require('../../middlewares/auth.middleware')
const usersController = require('../../controllers/User/user');
const express = require("express");
const router = express.Router();
const { uploadImagesS3, uploadDocumentsS3} = require("../../utils/s3BucketHelper");
const {
  uploadMultipleImage,
  uploadImage,
  uploadMultipleVideo,
  uploadVideo,
  uploadMultipleDocuments,
  uploadDocuments,
  deleteFile
} = require("../../controllers/file/fileHandler");



router.post("/login", usersController.login);
// router.put("/profile/update", userAuthMiddleware, usersController.updateProfile);
router.get("/class", userAuthMiddleware, usersController.getAllClass);
router.get("/subject", usersController.getAllSubject);
router.post("/logout", userAuthMiddleware, usersController.logout);
router.patch("/profile", userAuthMiddleware, usersController.updateProfile);
router.post("/image", userAuthMiddleware, uploadImagesS3.single('image'), uploadImage);
router.post("/doc", userAuthMiddleware, uploadDocumentsS3.single('doc'), uploadDocuments);
router.post("/file/delete", userAuthMiddleware, deleteFile);
router.get("/profile", userAuthMiddleware, usersController.getProfile);



module.exports = router;