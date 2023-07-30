var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");
/* GET home page. */
router.get("/", function (req, res, next) {});
router.get("/deuce", function (req, res, next) {
  res.json("hi deuce");
});
router.post("/register", authController.sign_up_post);
// router.get("/register", authController.allUsers);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/register",
    passReqToCallback: true,
  }),
  (req, res) => {
    // If you use "Content-Type": "application/json"
    // req.isAuthenticated is true if authentication was success else it is false
    res.json({ auth: req.isAuthenticated() });
  }
);
module.exports = router;
