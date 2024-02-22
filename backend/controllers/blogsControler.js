const { ObjectId } = require("mongodb");
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
  const { title, content, userId, reactions, comments, image, category, tags } =
    req.body;
  const blogObject = {
    title,
    content,
    userId,
    reactions,
    comments,
    image,
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
  const { reaction, userId } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(500).json({ error: "Blog id is not valid" });
  }

  try {
    let blog = await Blogs.findById(id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Check if the user has already reacted
    const existingReactionIndex = blog.reactions.findIndex(
      (react) => react.userId.toString() === userId
    );

    if (existingReactionIndex !== -1) {
      // If the user has already reacted, update the reaction
      blog.reactions[existingReactionIndex].reaction = reaction;
    } else {
      // If the user has not reacted, add a new reaction
      blog.reactions.push({ userId: req.user.id, reaction });
    }

    await blog.save();

    res.status(200).json(blog);
  } catch (error) {
    console.error("Error adding reaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeReaction = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(500).json({ error: "Blog id is not valid" });
  }

  const blog = await Blogs.findByIdAndUpdate(
    { _id: id },
    {
      $pull: { reactions: { userId: userId } },
    },
    { new: true }
  );
  if (!blog) {
    return res.status(404).json({ error: "Blog not found /failed to update" });
  }

  res.status(200).json(blog);
};

const getReactions = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(500).json({ error: "Post id is not valid " });
  }

  const reactions = await Blogs.findOne({ _id: id }, { reactions: 1, _id: 0 });
  if (!reactions) {
    return res.status(404).json({ error: "Post reactions not found" });
  }
  res.status(200).json(reactions);
};

module.exports = {
  getAllBlogs,
  getOneBlog,
  AddBlog,
  addComment,
  addReaction,
  removeReaction,
  getReactions,
};
