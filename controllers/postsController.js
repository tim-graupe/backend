const { body, validationResult } = require("express-validator");
const Post = require("../models/newPostModel");
const User = require("../models/newUserModel");

const { ObjectId } = require("mongodb");

//get friend reqs
exports.getFriendReqs = async function (req, res, next) {
  try {
    let friendReqs = await User.findOne({
      _id: req.user._id,
    })
      .populate("incomingFriendRequests", [
        "firstName",
        "lastName",
        "profile_pic",
      ])
      .exec();
    return res.status(200).send(friendReqs.incomingFriendRequests);
  } catch (err) {
    return res.status(500).json({ error: "Error found!", err });
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
  //user is the person whose profile is receiving the new post. Poster is the commenter
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
    // Find the sender and receiver by their IDs
    const sender = await User.findById(req.body.id);
    const receiver = await User.findById(req.params.id);
    // Check if sender and receiver are already friends
    if (sender.friends.includes(receiver._id)) {
      return res
        .status(400)
        .json({ error: "You are already friends with this user." });
    }
    // Check if a request has already been sent
    if (sender.outgoingFriendRequests.includes(receiver._id)) {
      return res.status(400).json({
        error: "You have already sent a friend request to this user.",
      });
    }
    // Check if the receiver has already received a request
    if (receiver.incomingFriendRequests.includes(sender._id)) {
      return res
        .status(400)
        .json({ error: "A friend request from this user is already pending." });
    }
    // Sends the friend request
    sender.outgoingFriendRequests.push(receiver._id);
    receiver.incomingFriendRequests.push(sender._id);

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: "Friend request sent successfully!" });
  } catch (err) {
    return res.status(500).json({ error: "Error found!", err });
  }
};
exports.acceptFriendReq = async function (req, res, next) {
  try {
    // RequestingFriendsId is the ID of the user who sent the request
    const requestingUserId = req.body.RequestingFriendsId._id;
    const currentUserID = req.user._id;

    // Update the current user's friends list
    await User.updateOne(
      { _id: currentUserID },
      {
        $push: { friends: new ObjectId(requestingUserId) },
        $pull: { incomingFriendRequests: requestingUserId },
      }
    );

    // Update the requesting user's friends list
    await User.updateOne(
      { _id: new ObjectId(requestingUserId) },
      {
        $push: { friends: currentUserID },
        $pull: { outgoingFriendRequests: currentUserID },
      }
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error occurred while accepting friend request" });
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

exports.getFriendsPosts = async function (req, res, next) {
  try {
    const user = await User.findById(req.user._id)
      .populate("friends", ["firstName", "lastName", "profile_pic", "posts"])
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
