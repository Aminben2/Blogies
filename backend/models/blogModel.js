const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reactionSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  reaction: {
    type: String,
    required: true,
  },
});

const commentSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    loved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    reactions: {
      type: [reactionSchema],
      default: [],
    },
    image: {
      type: [String],
      required: true,
    },
    ifCommentsEnabaled: {
      type: Boolean,
      required: true,
      default: true,
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
    private: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blogs", blogSchema);
