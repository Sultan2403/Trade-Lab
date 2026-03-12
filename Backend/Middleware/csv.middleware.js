const multer = require("multer");

const csv = require("csv-parser");
const { PassThrough } = require("stream");

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

function parseTrades(req, res, next) {
  if (!req.file)
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });

  const trades = [];
  const stream = new PassThrough();
  stream.end(req.file.buffer);

  stream
    .pipe(csv())
    .on("data", (row) => {
      trades.push({
        external_id: row["Ticket"],
        symbol: row["Symbol"],
        side: row["Type"],
        size: parseFloat(row["Size"]),
        entry_price: parseFloat(row["Price"]),
        exit_price: parseFloat(row["Close Price"]),
        pnl: parseFloat(row["Profit"]),
        commission: parseFloat(row["Commission"] || 0),
        swap: parseFloat(row["Swap"] || 0),
        entry_time: new Date(row["Open Time"]),
        exit_time: new Date(row["Close Time"]),
        source: "csv",
      });
    })
    .on("end", () => {
      req.trades = trades;
      next();
    })
    .on("error", (err) => next(err));
}

module.exports = { upload, parseTrades };
