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

exports.loginPost = async function (req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      console.log("user not found");
    } else {
      console.log(user);
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
    console.log("err");
  }
};
