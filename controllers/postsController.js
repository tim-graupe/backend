const { body, validationResult } = require("express-validator");
const Post = require("../models/newPostModel");
const User = require("../models/newUserModel");
const FriendReq = require("../models/friendReqModel");
const Friend = require("../models/friendModel");

exports.sendFriendReq = async function (req, res, next) {
  let friendReq = new FriendReq(req.user._id);
  try {
    let user = await User.findByIdAndUpdate(
      {
        _id: req.params.id,
      },

      {
        $push: { incomingFriendRequests: req.user._id },
      }
    );
  } catch (err) {
    return res.status(500).json({ error: "error found!", err });
  }
};
//
exports.getFriendReqs = async function (req, res, next) {
  let id = req.params.id;

  try {
    let user = await User.findById(id);
    let friendReqs = await User.find({
      _id: { $in: user.incomingFriendRequests },
    });
    return res.status(200).send(friendReqs);
  } catch (err) {
    return res.status(500).json({ error: "error found!", err });
  }
};

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

//get posts - old
// exports.getPosts = async function (req, res, next) {
//   try {
//     let user = await User.findById(req.params.id);

//     return res.status(200).json({ posts: user.posts });
//   } catch (err) {
//     return res
//       .status(500)
//       .json({ error: "Something went wrong in getting posts", err });
//   }
// };
// exports.editStatus = async function (req, res, next) {
//   try {
//     let user = await User.findByIdAndUpdate(req.params.id, {
//       status: req.body.content,
//     });
//     return res.status(200).json(user);
//   } catch (err) {
//     return res.status(500).json({ error: "Something went wrong!", err });
//   }
// };

exports.getPosts = async function (req, res, next) {
  try {
    let posts = await Post.find({ user: req.params.id })
      .populate("content")
      .populate("user")
      .populate("poster")
      .exec();
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: "error found!", err });
  }
};

exports.newTextPost = async function (req, res, next) {
  try {
    let user = await User.findById(req.params.id);
    let poster = await User.findById(req.body.poster);
    let newPost = new Post({
      content: req.body.content,
      poster: poster,
      likes: [],
      date_posted: Date.now(),
      user: user._id,
    });
    await newPost.save();
  } catch (err) {
    res.status(500).json({ error: "error found", err });
  }
};

// exports.newTextPost = async function (req, res, next) {
//   try {
//     let user = await User.findByIdAndUpdate(
//       {
//         _id: req.params.id,
//       },
//       {
//         $push: {
//           posts: {
// content: req.body.content,
// id: req.body.id,
// likes: [],
// date_posted: Date.now(),
// poster: req.body.poster,
// pic: req.body.pic,
//           },
//         },
//       }
//     );
//   } catch (err) {
//     return res.status(500).json({ error: "Something went wrong!", err });
//   }
// };

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

// exports.sendFriendReq = async function (req, res, next) {
//   try {
//     let user = await User.findByIdAndUpdate(
//       {
//         _id: req.params.id,
//       },
//       {
//         $push: {
//           incomingFriendRequests: {
//             FriendReq: {
//               sender: req.body.id,
//               recipient: req.params.id,
//               accepted: false,
//             },
//           },
//         },
//       }
//     );
//   } catch (err) {
//     return res.status(500).json({ error: "Error found!", err });
//   }
// };
//
exports.acceptFriendReq = async function (req, res, next) {
  console.log(res);
  // try {
  //   let friend = new Friend({
  //     friend: req.params.id,
  //   });
  // $push: {
  //   friends: {
  //     id: newFriendId;
  //   }
  // }
  // $pull: {
  //   incomingFriendRequests: req.params.id;
  // }
  // } catch (err) {
  //   return res.status(500).json({ error: "Error found!", err });
  // }
};
