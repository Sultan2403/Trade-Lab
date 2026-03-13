const multer = require("multer");

const csv = require("csv-parser");
const { PassThrough } = require("stream");

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
        trades.push({
          external_id: row["Ticket"]?.trim(),
          symbol: row["Symbol"]?.trim(),
          side: row["Type"]?.trim(),

          size: Number(row["Size"]) || 0,
          entry_price: Number(row["Price"]) || 0,
          exit_price: Number(row["Close Price"]) || 0,

          pnl: Number(row["Profit"]) || 0,
          commission: Number(row["Commission"]) || 0,
          swap: Number(row["Swap"]) || 0,

          entry_time: row["Open Time"] ? new Date(row["Open Time"]) : null,
          exit_time: row["Close Time"] ? new Date(row["Close Time"]) : null,

          source: "csv",
        });
      } catch (err) {
        console.error("Row parse error:", err);
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
