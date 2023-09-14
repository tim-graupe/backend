const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

//new text post
router.post("/user/:id/new_post", postsController.newTextPost);

//get user's post
router.get("/user/:id/posts", postsController.getPosts);

//like post
router.post("/likePost/:id", postsController.addLikeToPost);

//new comment
router.post("/commentOnPost/:id", postsController.newComment);
//user profile
router.get("/user/:id", postsController.getUser);

//edit user's status
// router.put("/user/:id", postsController.editStatus);

//edit user profile
router.put("/user/:id/bio", postsController.editUserInfo);

//search for user
router.get("/search", postsController.findUser);

//send friend req
router.post("/sendFriendReq/:id", postsController.sendFriendReq);

//get friend reqs
router.get("/getFriendReqs/:id", postsController.getFriendReqs);

//accept friend req
router.post("/acceptFriendReq/:id", postsController.acceptFriendReq);

//eject friend req
router.post("/acceptFriendReq/:id", postsController.rejectFriendReq);

//delete friend
router.post("/deleteFriend/:id", postsController.deleteFriend);

//get friends to view  user's profile
router.get("/getFriends/:id", postsController.getFriends);

//get friends posts for dashboard
router.get("/getFriendsPosts/:id", postsController.getFriendsPosts);

//get friends list for dashboard
router.get("/getFriends/", postsController.getFriendsList);

//create new group
router.post("/newGroup", postsController.createGroup);

//show group
router.get("/group/:id", postsController.getGroup);
module.exports = router;
