const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, minLength: 1, maxLength: 30 },
  lastName: { type: String, minLength: 1, maxLength: 30 },
  email: { type: String, unique: true },
  password: { type: String, default: "" },
  profile_pic: { type: String, default: "" },
  status: { type: String, default: "", maxLength: 25 },
  relationship: { type: String, default: "" },
  politics: { type: String, default: "" },
  high_school: { type: String, default: "" },
  college: { type: String, default: "", maxLength: 50 },
  current_city: { type: String, default: "", maxLength: 85 },
  home_town: { type: String, default: "", maxLength: 85 },
  dob: { type: Date },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  incomingFriendRequests: { type: Array },
  outgoingFriendRequests: { type: Array },
});

UserSchema.pre("save", function (next) {
  const user = this;

  // Generate a salt and hash the password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};
module.exports = mongoose.model("User", UserSchema);
