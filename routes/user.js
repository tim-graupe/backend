const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

//new text post
router.post("/user/:id/new_post", postsController.newTextPost);

//get user's posts
router.get("/user/:id/posts", postsController.getPosts);
//user profile
router.get("/user/:id", postsController.getUser);

//edit user's status
router.put("/user/:id", postsController.editStatus);

//search for user
router.get("/search", postsController.findUser);

module.exports = router;
