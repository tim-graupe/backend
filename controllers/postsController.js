const { body, validationResult } = require("express-validator");
const Post = require("../models/newPostModel");
const User = require("../models/newUserModel");
const Comment = require("../models/commentModel");
const Group = require("../models/newGroupmodel");
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
    let user = await User.findById(userId)
      .populate("friends", ["firstName", "lastName", "profile_pic"])
      .exec();
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
      .populate("likes")
      .populate("comments")
      .exec();
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: "error found!", err });
  }
};

exports.addLikeToPost = async function (req, res, next) {
  try {
    const currentUserID = req.user._id;
    const postToBeLiked = req.body.postId;
    // Update the current post's like count
    await Post.findOneAndUpdate(
      { _id: postToBeLiked },
      {
        $push: { likes: currentUserID },
      }
    );

    res.status(200).json({ message: "Like sent successfully!" });
  } catch (err) {
    return res.status(500).json({ error: "Error found!" });
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
      type: "post",
    });
    await newPost.save();
  } catch (err) {
    res.status(500).json({ error: "error found", err });
  }
};

//leave comment reply on a post
exports.newComment = async function (req, res, next) {
  try {
    const user = req.user;
    const postId = req.body.postId;
    const commentText = req.body.comment;

    // Create a new comment
    const newComment = new Comment({
      comment: commentText,
      likes: [],
      date_posted: Date.now(),
      user: user._id,
      pic: user.profile_pic,
    });

    // Save the new comment
    await newComment.save();

    // Find the post by its ID and push the new comment to its comments array
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: newComment },
      },
      { new: true } // Return the updated post
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ message: "Comment sent successfully!" });
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    res.status(500).json({ error: "Error occurred while creating a comment" });
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
//send a friend request
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

//accept friend req
exports.acceptFriendReq = async function (req, res, next) {
  try {
    const requestingUser = req.body.RequestingFriendsId;
    const currentUser = req.user;

    // Update the current user's friends list
    await User.updateOne(
      { _id: currentUser._id },
      {
        $push: { friends: requestingUser },
        $pull: { incomingFriendRequests: requestingUser },
      }
    );

    // Update the requesting user's friends list
    await User.updateOne(
      { _id: requestingUser },
      {
        $push: { friends: currentUser._id },
        $pull: { outgoingFriendRequests: currentUser._id },
      }
    );

    const contentReqUser = `${requestingUser.firstName} ${requestingUser.lastName} is now friends with ${currentUser.firstName} ${currentUser.lastName}`;
    const contentLoggedUser = `${currentUser.firstName} ${currentUser.lastName} is now friends with ${requestingUser.firstName} ${requestingUser.lastName}`;

    // Create new posts for both users
    const newPostForReqUser = new Post({
      content: contentReqUser,
      poster: requestingUser,
      type: "newFriend",
    });
    await newPostForReqUser.save();

    const newPostForLoggedUser = new Post({
      content: contentLoggedUser,
      poster: currentUser._id,
      type: "newFriend",
    });
    await newPostForLoggedUser.save();

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error occurred while accepting friend request" });
  }
};

exports.rejectFriendReq = async function (req, res, next) {
  try {
    // RequestingFriendsId is the ID of the user who sent the request
    const requestingUser = req.body.RequestingFriendsId._id;
    const currentUserID = req.user._id;

    // Update the current user's friends list
    await User.updateOne(
      { _id: currentUserID },
      {
        $pull: { incomingFriendRequests: requestingUser },
      }
    );

    // Update the requesting user's friends list
    await User.updateOne(
      { _id: new ObjectId(requestingUser) },
      {
        $pull: { outgoingFriendRequests: currentUserID },
      }
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error occurred while rejecting friend request" });
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

//getFriendsList shows the loggedin user's profile pics and names for their dashboard
exports.getFriendsList = async function (req, res, next) {
  try {
    const user = await User.findById(req.user._id)
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

//Used to show friends post feed on user's homepage / main dashboard
exports.getFriendsPosts = async function (req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const friendsPosts = await Post.find({
      poster: { $in: user.friends },
    }).populate("poster", ["firstName", "lastName", "profile_pic"]);

    return res.status(200).json({ friendsPosts });
  } catch (err) {
    res.status(500).json({ error: "Error found!", err });
  }
};

exports.deleteFriend = async function (req, res, next) {
  try {
    // RequestingFriendsId is the ID of the user who sent the request
    const deletedUsersId = new ObjectId(req.params.id);
    const currentUserID = req.user._id;

    // Update the current user's friends list
    await User.updateOne(
      { _id: currentUserID },
      {
        $pull: { friends: deletedUsersId },
      }
    );

    // Update the requesting user's friends list
    await User.updateOne(
      { _id: deletedUsersId },
      {
        $pull: { friends: currentUserID },
      }
    );

    return res
      .status(200)
      .json({ success: true, message: "friend successfully removed" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error occurred while deleting friend" });
  }
};

exports.createGroup = async function (req, res, next) {
  try {
    let user = req.user._id;
    let newGroup = new Group({
      name: req.body.name,
      description: req.body.description,
      pic: req.body.pic,
      private: req.body.isPrivate,
      admin: [user],
      members: [user],
    });
    await newGroup.save();
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error occurred while creating a group" });
  }
};

// exports.editStatus = async function (req, res, next) {
//   try {
//     let user = await User.findByIdAndUpdate(req.body.user, {
//       status: req.body.content,
//     });
//     let newPost = new Post({
//       content: req.body.content,
//       poster: user,
//       likes: [],
//       date_posted: Date.now(),
//       user: req.body.user,
//       type: "status",
//     });
//     await newPost.save();
//     return res.status(200).json(user);
//   } catch (err) {
//     return res.status(500).json({ error: "Something went wrong!", err });
//   }
// };
