const rateLimiter = require("express-rate-limit");

const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
//   store: {}, Add redis here later
  message: {
    success: false,
    error: "Too many requests, please try again later.",
  },
});

module.exports = { authLimiter };
