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
  const { title, content, userId, reactions, comments, img, category, tags } =
    req.body;
  const blogObject = {
    title,
    content,
    userId,
    reactions,
    comments,
    img,
    category,
    tags,
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

module.exports = {
  getAllBlogs,
  getOneBlog,
  AddBlog,
  addComment,
  addReaction,
};
