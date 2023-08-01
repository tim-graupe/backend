const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

//new text post
router.post("/user/:id/new_post", postsController.newTextPost);
//user profile
router.get("/user/:id", postsController.getUser);

//edit user's status
router.put("/user/:id", postsController.editStatus);

module.exports = router;
