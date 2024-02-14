const Blogs = require("../models/blogModel");
const mongoose = require("mongoose");

const getAllBlogs = async (req, res) => {
  const blogs = await Blogs.find().sort({ createdAt: -1 });
  res.status(200).json(blogs);
};

const getOneBlog = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(500).json({ error: "The is is not valid" });
  }
  const blog = await Blogs.findById(id);

  if (!blog) {
    return res.status(404).json({ error: "No such blog" });
  }

  res.status(200).json(blog);
};

const AddBlog = async (req, res) => {
  const { title, content, userId, reactions, comments } = req.body;
  const blogObject = {
    title,
    content,
    userId,
    reactions,
    comments,
  };

  try {
    const blog = await Blogs.create(blogObject);
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addComment = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(500).json({ error: "id not valid" });
  }

  const blog = await Blogs.findByIdAndUpdate(
    { _id: id },
    { $push: { comments: req.body } }
  );

  if (!blog) return res.status(404).json({ error: "No such blog" });
  res.status(200).json(blog);
};

const addReaction = async (req, res) => {
  const { postId, reaction } = req.body;

  const blog = await Blogs.findByIdAndUpdate(
    { _id: postId },
    { $inc: { [`reactions.${reaction}`]: 1 } }
  );

  if (!blog)
    return res.status(500).json({ error: "Could Not increment the reaction" });
  res.status(200).json(blog);
};

const getUserPost = async (req, res) => {
  const { id } = req.params;
  // try {
  //     const blogs = await Blogs.find({ userId: id })
  //     res.status(200).json(blogs)

  // } catch (error) {
  //     res.status(500).json({ error: "error hh" })
  // }
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
  const { postId, private } = req.body;

  const post = await Blogs.findByIdAndUpdate(
    { _id: postId },
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
  getAllBlogs,
  getOneBlog,
  AddBlog,
  addComment,
  addReaction,
  uploadImage,
  getUserPost,
  deleteUserBlog,
  changePrivacy,
  deleteComment,
};
