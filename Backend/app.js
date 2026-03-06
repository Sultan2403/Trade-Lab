//  Main
const express = require("express");
const app = express();

//  Helpers
const cors = require("cors");
const connectDB = require("./DB/Connections/connectDB");
const { errors } = require("celebrate");

//  Routers
const authRouter = require("./Routers/auth.route");

// Middlewares
const { authLimiter } = require("./Middleware/rate-limiter.middleware");
const authMiddleware = require("./Middleware/auth.middleware");

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());

// Routes

app.use("/auth", authLimiter, authRouter);


app.get("/health", (req, res) => {
  res.json({ success: true, message: "Server says Heyyyy! :)" });
});

// Celebrate errors middleware
app.use(errors());

module.exports = app;
