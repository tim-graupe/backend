const mongoose = require("mongoose");

const FriendSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  profile_pic: String,
  status: String,
  posts: Array,

  dob: Date,
});

// Export model
module.exports = mongoose.model("Friend", FriendSchema);
