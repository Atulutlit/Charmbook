require('dotenv').config();
const multer = require("multer");
const path = require("path");
const multerS3 = require("multer-s3");
const { DeleteObjectCommand, S3Client } = require("@aws-sdk/client-s3");

// Images : JPEG , PNG
// Video: MP4, MOV, AVI, WMV
// DOC: PDF, DOC/DOCX,JPG/PNG

var s3 = new S3Client({
    region: 'ap-south-1',
    credentials: {
        Bucket: process.env.bucket,
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey,
    }
});

const storage = multerS3({
    s3: s3,
    bucket: process.env.bucket,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    serverSideEncryption: "AES256",
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        cb(
            null,
            file.fieldname +
            "-" +
            path.parse(file.originalname).name.replace(/[^a-z0-9]/gi, "-") +
            "-" +
            Date.now() +
            "-" +
            Math.floor(100000 + Math.random() * 900000) +
            path.extname(file.originalname)
        );
    },
})

const uploadImagesS3 = multer({
    storage,
    limits: { fileSize: 1024 * 50280 }, // 50 MB
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/octet-stream'];
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', 'WEBP'];
        if (allowedMimes.includes(file.mimetype)) {
            const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.'));
            if (allowedExtensions.includes(fileExtension)) {
                cb(null, true);
                // return cb(new Error('Invalid file extension. Only JPEG, PNG files are allowed.'));
            } else {
                // cb(null, false);
                return cb(new Error('Invalid file name. Only JPEG, PNG files are allowed.'));
            }
        } else {
            // cb(null, false);
            return cb(new Error('Invalid file type. Only JPEG, PNG files are allowed.'));
        }
    },
});

const uploadVideosS3 = multer({
    storage,
    limits: { fileSize: 1024 * 409600 }, // 400 MB
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedMimes = ['video/mp4', 'video/mov', 'video/avi', 'video/wmv', 'application/octet-stream'];
        const allowedExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.MP4', '.MOV', '.AVI', '.WMV'];
        if (allowedMimes.includes(file.mimetype)) {
            const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.'));
            if (allowedExtensions.includes(fileExtension)) {
                cb(null, true);
                // return cb(new Error('Invalid file extension. Only MP4, MOV, AVI, WMV files are allowed.'));
            } else {
                // cb(null, false);
                return cb(new Error('Invalid file name. Only MP4, MOV, AVI, WMV files are allowed.'));
            }
        } else {
            // cb(null, false);
            return cb(new Error('Invalid file type. Only MP4, MOV, AVI, WMV files are allowed.'));
        }
    },
});

const uploadDocumentsS3 = multer({
    storage,
    limits: { fileSize: 1024 * 409600 }, // 400 MB
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedMimes = ['image/png', 'image/jpeg', 'image/jpeg', 'application/pdf', 'application/postscript', 'application/cdr', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/msword', 'text/csv', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const allowedExtensions = ['.png', '.jpeg', '.jpg', '.pdf', '.ai', '.cdr', '.xls', '.xlsx', '.word', '.csv', '.doc', '.docx', '.PNG', '.JPEG', '.JPG', '.PDF', '.AI', '.CDR', '.XLS', '.XLSX', '.WORD', '.CSV', '.DOC', '.DOCX'];
        if (allowedMimes.includes(file.mimetype)) {
            const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.'));
            if (allowedExtensions.includes(fileExtension)) {
                cb(null, true);
            } else {
                // cb(null, false);
                return cb(new Error('Invalid file name. Only JPEG, JPG, PNG, PDF, DOC, DOCX files are allowed.'));
            }
        } else {
            // cb(null, false);
            return cb(new Error('Invalid file type. Only JPEG, JPG, PNG, PDF, DOC, DOCX files are allowed.'));
        }
    }
});

const deleteFilesS3 = async function (fileName) {
    try {
        if (fileName && typeof fileName === 'string' || fileName instanceof String) {

            const params = {
                Bucket: process.env.bucket,
                Key: fileName
            }

            const command = new DeleteObjectCommand(params);
            return new Promise((resolve, reject) => {
                s3.send(command).then(doc => {
                    resolve(true);
                }).catch((err) => {
                    console.log(err)
                    resolve(false)
                })

            })

        } else {
            throw 'Something went wrong.';
        }
    } catch (error) {
        throw error;
    }
};


module.exports = {
    uploadImagesS3,
    uploadVideosS3,
    uploadDocumentsS3,
    deleteFilesS3
}