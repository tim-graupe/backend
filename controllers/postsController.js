const { body, validationResult } = require("express-validator");
const Post = require("../models/newPostModel");
const User = require("../models/newUserModel");

exports.getUser = async function (req, res, next) {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId);
    return res.status(200).send(user);
  } catch (err) {
    console.log("err", err);
    return res
      .status(500)
      .json({ error: "Something went wrong in getting user" });
  }
};

//get posts
exports.getPosts = async function (req, res, next) {
  try {
    let user = await User.findById(req.params.id);

    return res.status(200).json({ posts: user.posts });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Something went wrong in getting posts", err });
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
            poster: req.body.poster,
            pic: req.body.pic,
            //convert this later to Short Month Name Day Year Time
          },
        },
      }
    );
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong!", err });
  }
};

//search user
exports.findUser = async function (req, res, next) {
  const searchName = req.query.name
    .split(" ")
    .filter((name) => name.trim() !== "");
  const searchQuery = {
    $or: [
      {
        firstName: {
          $in: searchName.map((name) => new RegExp(name, "i")),
        },
      },
      {
        lastName: {
          $in: searchName.map((name) => new RegExp(name, "i")),
        },
      },
    ],
  };

  try {
    const searchResults = await User.find(searchQuery);
    res.json(searchResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.editUserInfo = async function (req, res, next) {
  try {
    let user = await User.findByIdAndUpdate(req.params.id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      // profile_pic: { type: String, default: "" },
      relationship: req.body.relationship,
      politics: req.body.politics,
      high_school: req.body.high_school,
      college: req.body.college,
      current_city: req.body.current_city,
      home_town: req.body.home_town,
      // dob: req.body.dob,
    });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong!", err });
  }
};

// exports.findUser = async function (req, res, next) {
//   try {
//     const searchResults = await User.find({
//       $expr: {
//         $regexMatch: {
//           input: { $concat: ["$firstName", " ", "$lastName"] },
//           regex: req.firstName,
//           options: "i",
//         },
//       },
//     });
//     res.json(searchResults);
//   } catch (err) {
//     console.log(err);
//   }
// };
