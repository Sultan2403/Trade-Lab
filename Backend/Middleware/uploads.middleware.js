const multer = require("multer");

// Store file in memory instead of disk
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["text/csv", "application/vnd.ms-excel"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // optional: 5 MB max
  },
});

module.exports = upload;
