const createError = require("http-errors");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const logger = require("morgan");
const passport = require("passport");
const app = express();
require("dotenv").config();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//cors
const cors = require("cors");
const allowedOrigins = ["http://localhost:3000", "https://localhost:3000"];
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(cors(allowedOrigins));

//mongoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.mongoDB;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

//routes
const authRouter = require("./routes/auth");
app.use("/", authRouter);
app.use("/register", authRouter);
app.use("/login", authRouter);
const port = 4000;
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

//passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email: email });
        console.log(user);

        if (!user) {
          console.log("Incorrect username.");
          return done(null, false);
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log(passwordMatch);
        if (!passwordMatch) {
          console.log("Incorrect password.");
          return done(null, false);
        }
        console.log("passwords match!");
        return done(null, user);
      } catch (err) {
        console.log(err);
        return done(err);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
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
