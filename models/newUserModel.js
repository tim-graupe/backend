const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minLength: 1, maxLength: 30 },
  lastName: { type: String, required: true, minLength: 1, maxLength: 30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, maxLength: 25 },
  dob: { type: Date, required: true },
  posts: { type: Array },
  photos: { type: Array },
  friends: { type: Array },
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
