var createError = require("http-errors");
var express = require("express");
var path = require("path");
// var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.mongoDB;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}
var authRouter = require("./routes/auth");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use("/", authRouter);
app.use("/register", authRouter);
app.use("/login", authRouter);
const port = 4000;
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
