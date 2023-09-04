const { body, validationResult } = require("express-validator");
const Post = require("../models/newPostModel");
const User = require("../models/newUserModel");
const FriendReq = require("../models/friendReqModel");
const Friend = require("../models/friendModel");

//get friend reqs
exports.getFriendReqs = async function (req, res, next) {
  try {
    let friendReqs = await FriendReq.find({
      receiver: req.user._id,
    })
      .populate("sender", ["firstName", "lastName", "profile_pic"])
      .exec();
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

exports.sendFriendReq = async function (req, res, next) {
  try {
    let sender = await User.findById(req.body.id);
    let receiver = await User.findById(req.params.id);
    let newFriendReq = new FriendReq({
      sender: sender,
      receiver: receiver,
    });
    await newFriendReq.save();
  } catch (err) {
    return res.status(500).json({ error: "Error found!", err });
  }
};
exports.acceptFriendReq = async function (req, res, next) {
  try {
    let newFriend = new Friend({
      friend: req.body.id,
    });

    await newFriend.save();
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.user._id },
      {
        $push: {
          friends: newFriend.friend, // Push the _id of the new friend
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error found!", err });
  }
};
exports.getFriends = async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id)
      .populate("friends", ["firstName", "lastName", "profile_pic"])
      .exec();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error found!", err });
  }
};
