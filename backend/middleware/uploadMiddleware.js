const multer = require('multer');
const path = require('path');

// Set Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  const mime = file.mimetype; // ✅ FIX: get mimetype from file object

  if (
    (ext === '.jpg' || ext === '.jpeg' || ext === '.png') &&
    (mime === 'image/jpeg' || mime === 'image/jpg' || mime === 'image/png')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only jpg, jpeg, and png files are allowed'), false);
  }
};

// Create the multer upload
const uploads = multer({
  storage,
  fileFilter,
});

module.exports = uploads;
