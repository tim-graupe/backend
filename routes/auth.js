var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ auth: req.isAuthenticated(), user: req.user });
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

module.exports = router;
