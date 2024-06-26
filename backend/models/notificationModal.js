const { Schema, model } = require("mongoose");
const NotificationSchema = new Schema(
  {
    postOwner: {
      required: true,
      type: String,
    },
    userId: {
      required: true,
      type: String,
    },
    postId: {
      type: String,
    },
    title: {
      required: true,
      type: String,
    },
    subject: {
      required: true,
      type: String,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model("notification", NotificationSchema);
