const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");
require("dotenv").config();

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = `${Date.now()}_${file.originalname}`;
      const fileInfo = {
        filename: filename,
        bucketName: "uploads", // GridFS bucket name
      };
      resolve(fileInfo);
    });
  },
});

const upload = multer({ storage });

module.exports = upload;