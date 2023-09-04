const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

//new text post
router.post("/user/:id/new_post", postsController.newTextPost);

//get user's post
router.get("/user/:id/posts", postsController.getPosts);
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

//get friends
router.get("/getFriends/:id", postsController.getFriends);
module.exports = router;
