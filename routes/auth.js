var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.json("hi");
});
router.get("/deuce", function (req, res, next) {
  res.json("hi deuce");
});
router.post("/register", authController.sign_up_post);
router.get("/register", authController.allUsers);
router.post("/login", authController.loginPost);
module.exports = router;
