const multer = require("multer");

const csv = require("csv-parser");
const { PassThrough } = require("stream");
const { normalizeTrade } = require("../Helpers/csv.helper");


const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["text/csv", "application/vnd.ms-excel"];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

function parseTrades(req, res, next) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No CSV file uploaded",
    });
  }

  const trades = [];
  const stream = new PassThrough();

  stream.end(req.file.buffer);

  stream
    .pipe(csv())
    .on("data", (row) => {
      try {
        trades.push(normalizeTrade(row));
      } catch (err) {
        console.error(err)
        console.log("csv parsing err, bad row");
      }
    })
    .on("end", () => {
      console.log("CSV parsing finished");
      req.trades = trades;
      next();
    })
    .on("error", (err) => {
      console.error("CSV stream error:", err);
      next(err);
    });
}

const uploadCSV = upload.single("csv-file");

module.exports = { uploadCSV, parseTrades };
