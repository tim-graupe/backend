var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send({ auth: req.isAuthenticated(), user: req.user });
});

router.post("/register", authController.sign_up_post);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/register",
    passReqToCallback: true,
  }),
  (req, res) => {
    // res.json({ user: req.user });
    res.json({ auth: req.isAuthenticated(), user: req.user });
  }
);

// router.post(
//   "/login",
//   passport.authenticate("google", {
//     successRedirect: "/",
//     failureRedirect: "/register",
//     passReqToCallback: true,
//   }),
//   (req, res) => {
//     // res.json({ user: req.user });
//     res.json({ auth: req.isAuthenticated(), user: req.user });
//   }
// );

router.use(function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
    res.send({ user: req.user });
  }
  return next();
});

module.exports = router;
