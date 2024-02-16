const Blogs = require("../models/blogModel");
const mongoose = require("mongoose");

const getUserPost = async (req, res) => {
  const { id } = req.params;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const blogs = await Blogs.find({ userId: id });

    if (!blogs)
      return res.status(400).json({ error: "Could not find user posts" });
    res.status(200).json(blogs);
  } else {
    res.status(501).json({ error: "The user id is not valid" });
  }
};

const deleteUserBlog = async (req, res) => {
  const idPost = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(idPost)) {
    return res.status(501).json({ error: "Post id is not valid" });
  }

  const post = await Blogs.findOneAndDelete({ _id: idPost });
  if (!post) {
    return res.status(400).json({ error: "Post not found" });
  }

  res.status(200).json(post);
};

const changePrivacy = async (req, res) => {
  const { private } = req.body;
  const { id } = req.params;

  const post = await Blogs.findByIdAndUpdate(
    { _id: id },
    { $set: { private: private } }
  );
  if (!post)
    return res.status(501).json({ error: "Could not update the privacy" });

  res.status(200).json(post);
};

const deleteComment = async (req, res) => {
  const { postId } = req.body;
  const { id } = req.params;

  const post = await Blogs.findByIdAndUpdate(
    { _id: postId },
    {
      $pull: { comments: { _id: id } },
    }
  );

  if (!post) return res.status(404).json({ error: "Blog/comment not found" });

  res.status(200).json(post);
};
const pinComment = async (req, res) => {
  const { postId } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId))
    return res.status(501).json({ error: "Blog id is not valid !" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(501).json({ error: "Comment id is not valid !" });

  const existingComment = await Blogs.findOne(
    { _id: postId, "comments._id": id },
    { "comments.$": 1 }
  );
  if (!existingComment)
    return res.status(400).json({ error: "Comment not found" });

  if (existingComment && existingComment.comments.length > 0) {
    const currentPinnedValue = existingComment.comments[0].pinned;

    // Perform the update
    const blog = await Blogs.findOneAndUpdate(
      { _id: postId, "comments._id": id }, // Match the blog and the comment
      { $set: { "comments.$.pinned": !currentPinnedValue } }, // Toggle the value of pinned
      { new: true }
    );
    if (!blog) return res.status(400).json({ error: "Blog not found" });
    return res.status(200).json(blog);
  }
};

const apreciateComment = async (req, res) => {
  const { postId } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId))
    return res.status(501).json({ error: "Blog id is not valid !" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(501).json({ error: "Comment id is not valid !" });

  const existingComment = await Blogs.findOne(
    { _id: postId, "comments._id": id },
    { "comments.$": 1 }
  );
  if (!existingComment)
    return res.status(400).json({ error: "Comment not found" });

  if (existingComment && existingComment.comments.length > 0) {
    const currentPinnedValue = existingComment.comments[0].loved;

    // Perform the update
    const blog = await Blogs.findOneAndUpdate(
      { _id: postId, "comments._id": id }, // Match the blog and the comment
      { $set: { "comments.$.loved": !currentPinnedValue } }, // Toggle the value of pinned
      { new: true }
    );
    if (!blog) return res.status(400).json({ error: "Blog not found" });
    return res.status(200).json(blog);
  }
};

module.exports = {
  deleteComment,
  changePrivacy,
  deleteUserBlog,
  getUserPost,
  pinComment,
  apreciateComment
};
