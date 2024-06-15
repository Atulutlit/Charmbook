
const { deleteFilesS3 } = require("../../utils/s3BucketHelper");

const uploadMultipleImage = async (req, res) => {
  try {
    let images = [String];
    if (req.files && req.files.length) {
      images = req.files.map((_) => {
        return _.location;
      });
    }
    if (images.length) {
      return res.json({
        meta: { msg: "Images uploaded successfully.", status: true },
        data: images,
      });
    } else {
      return res.json({
        meta: { msg: "Something went wrong", status: false },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      meta: { msg: error.message, status: false },
    });
  }
};

const uploadImage = async (req, res) => {
  try {
    if (req.file && req.file.location) {
      return res.json({
        meta: { msg: "Image uploaded successfully.", status: true },
        data: req.file.location,
      });
    } else {
      return res.json({
        meta: { msg: "Something went wrong", status: false },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      meta: { msg: error.message, status: false },
    });
  }
};


const uploadMultipleVideo = async (req, res) => {
  try {
    let videos = [String];
    if (req.files && req.files.length) {
      videos = req.files.map((_) => {
        return _.location;
      });
    }
    if (videos.length) {
      return res.json({
        meta: { msg: "Videos uploaded successfully.", status: true },
        data: videos,
      });
    } else {
      return res.json({
        meta: { msg: "Something went wrong", status: false },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      meta: { msg: error.message, status: false },
    });
  }
};

const uploadVideo = async (req, res) => {
  try {
    if (req.file && req.file.location) {
      return res.json({
        meta: { msg: "Video uploaded successfully.", status: true },
        data: req.file.location,
      });
    } else {
      return res.json({
        meta: { msg: "Something went wrong", status: false },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      meta: { msg: error.message, status: false },
    });
  }
};

const uploadMultipleDocuments = async (req, res) => {
  try {
    let documents = [String];
    if (req.files && req.files.length) {
      documents = req.files.map((_) => {
        return _.location;
      });
    }
    if (documents.length) {
      return res.json({
        meta: { msg: "Documents uploaded successfully.", status: true },
        data: documents,
      });
    } else {
      return res.json({
        meta: { msg: "Something went wrong", status: false },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      meta: { msg: error.message, status: false },
    });
  }
};

const uploadDocuments = async (req, res) => {
  try {
    if (req.file && req.file.location) {
      return res.json({
        meta: { msg: "Document uploaded successfully.", status: true },
        data: req.file.location,
      });
    } else {
      return res.json({
        meta: { msg: "Something went wrong", status: false },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      meta: { msg: error.message, status: false },
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { file_path } = req.body;
    if (file_path) {
      const deleteImage = await deleteFilesS3(file_path);
      if (deleteImage) {
        return res.json({
          meta: { msg: "File deleted successfully.", status: true },
        });
      }
    } else {
      return res.json({
        meta: { msg: "Something went wrong", status: false },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      meta: { msg: error.message, status: false },
    });
  }
};

module.exports = {
  uploadMultipleImage,
  uploadImage,
  uploadMultipleVideo,
  uploadVideo,
  uploadMultipleDocuments,
  uploadDocuments,
  deleteFile,
};
