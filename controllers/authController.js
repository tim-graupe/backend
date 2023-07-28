const { body, validationResult } = require("express-validator");
const User = require("../models/newUserModel");
const bcrypt = require("bcryptjs");
const validator = require("email-validator");

exports.sign_up_post = [
  body("firstName", "First Name required!")
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape(),
  body("lastName", "Last Name is required!")
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape(),
  body("password").trim().isLength({ min: 6 }).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    let email = await User.findOne({ email: req.body.email });
    if (email) {
      return res.status(400).json({ error: "Email address already in use." });
    }
    if (!errors.isEmpty() && !email) {
      return;
    }
    if (!errors.isEmpty()) {
      return;
    }
    if (!validator.validate(req.body.email)) {
      return res.status(400).json({ error: "Invalid email" });
    }
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync()),
      email: req.body.email,
      // dob: req.body.dob,
    });
    user.save();
    res.json(user);
  },
];

exports.allUsers = async function (req, res, next) {
  try {
    const user = await User.find().populate("email").exec();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(200).json({ message: "No users found." });
  }
};

exports.loginGet = async function (req, res, next) {
  res.sendFile(__dirname + "/");
};

exports.loginPost = async function (req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: req.body.username });

    if (!user) {
      console.log("user not found");
    }

    const res = await bcrypt.compare(password, user.password);
    if (res) {
      console.log("match!");
      console.log(res);
      // passwords match! log user in
      console.log(user);
    } else {
      console.log({ message: "Incorrect password" });
    }
  } catch (err) {
    console.log(err);
    console.log(err);
  }
};
