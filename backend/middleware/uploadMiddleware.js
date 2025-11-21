const multer = require("multer");
const path = require("path");

// Set Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.resolve(__dirname, "../uploads/");
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Sanitize filename to prevent path traversal
    const sanitizedName = path.basename(file.originalname);
    const ext = path.extname(sanitizedName);
    cb(null, Date.now() + ext);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  // Additional security checks
  if (!file.originalname || file.originalname.length > 255) {
    return cb(new Error('Invalid filename'), false);
  }
  
  // Check for null bytes and dangerous characters
  if (file.originalname.includes('\0') || /[<>:"/\|?*]/.test(file.originalname)) {
    return cb(new Error('Invalid filename'), false);
  }

  // Validate file extension and MIME type
  const allowedExts = [".jpg", ".jpeg", ".png"];
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];

  if (allowedExts.includes(ext) && allowedMimes.includes(mime)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, and PNG files are allowed"), false);
  }
};

// Create the multer upload
const uploads = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1,
  },
});

module.exports = uploads;
