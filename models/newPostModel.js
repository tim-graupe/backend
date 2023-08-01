const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const PostSchema = new Schema({
  content: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 1000,
  },
  date_posted: { type: Date, default: Date.now },
  likes: { type: Array },
  replies: { type: Array },
});

PostSchema.virtual("url").get(function () {
  return DateTime.fromJSDate(this.date_posted).toLocaleString(
    DateTime.DATETIME_MED
  );
});

PostSchema.virtual("date_posted_formatted").get(function () {
  return DateTime.fromJSDate(this.date_posted).toISODate();
});

// Export model
module.exports = mongoose.model("Post", PostSchema);
