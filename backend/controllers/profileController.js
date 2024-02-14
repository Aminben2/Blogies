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
  const { postId, commentId } = req.body;

  const post = await Blogs.findByIdAndUpdate(
    { _id: postId },
    {
      $pull: { comments: { commentId: commentId } },
    }
  );

  if (!post) return res.status(404).json({ error: "Blog/comment not found" });

  res.status(200).json(post);
};

module.exports = {
  deleteComment,
  changePrivacy,
  deleteUserBlog,
  getUserPost,
};
