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
    }
  );
  if (!blog) {
    return res.status(404).json({ error: "Blog not found /failed to update" });
  }
  // Remove the user's reaction
  // blog.reactions = blog.reactions.filter(
  //   (react) => react.userId.toString() !== userId
  // );

  // await blog.save();

  res.status(200).json(blog);
};

// const addReaction = async (req, res) => {
//   const { reaction } = req.body;
//   const { id } = req.params;
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(500).json({ error: "Blog id is not valid " });
//   }
//   const blog = await Blogs.findByIdAndUpdate(
//     { _id: id },
//     { $inc: { [`reactions.${reaction}`]: 1 } }
//   );

//   if (!blog)
//     return res.status(500).json({ error: "Could Not increment the reaction" });
//   res.status(200).json(blog);
// };
// const removeReaction = async (req, res) => {
//   const { reaction } = req.body;
//   const { id } = req.params;
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(500).json({ error: "Blog id is not valid " });
//   }
//   const decrementValue = -1;
//   const blog = await Blogs.findByIdAndUpdate(
//     { _id: id },
//     { $inc: { [`reactions.${reaction}`]: decrementValue } }
//   );

//   if (!blog)
//     return res.status(500).json({ error: "Could Not decrement the reaction" });
//   res.status(200).json(blog);
// };

module.exports = {
  getAllBlogs,
  getOneBlog,
  AddBlog,
  addComment,
  addReaction,
  removeReaction,
};
