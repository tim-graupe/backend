const { body, validationResult } = require("express-validator");
const Post = require("../models/newPostModel");
const User = require("../models/newUserModel");

exports.getUser = async function (req, res, next) {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId);
    console.log("req.params.id", userId);
    return res.status(200).send(user);
  } catch (err) {
    console.log("err", err);
    return res
      .status(500)
      .json({ error: "Something went wrong in getting user", err });
  }
};

exports.editStatus = async function (req, res, next) {
  try {
    let user = await User.findByIdAndUpdate(req.params.id, {
      status: req.body.content,
    });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong!", err });
  }
};

exports.newTextPost = async function (req, res, next) {
  try {
    let user = await User.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $push: {
          posts: {
            content: req.body.content,
            replies: [],
            likes: [],
            date_posted: Date.now(),
            //convert this later to Short Month Name Day Year Time
          },
        },
      }
    );
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong!", err });
  }
};
