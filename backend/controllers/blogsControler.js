const Blogs = require("../models/blogModel");
const Notification = require("../models/notificationModal");
const mongoose = require("mongoose");
const userModel = require("../models/userModel");

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

const getLatestBlogs = async (req, res) => {
  try {
    // Fetch the latest blogs, sorting by creation date in descending order
    const latestBlogs = await Blogs.find().sort({ createdAt: -1 }).limit(3);

    // Send the blogs in the response
    res.status(200).json(latestBlogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch latest blogs" });
  }
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

  if (req.user._id !== blog.userId) {
    const userCmnt = await userModel.findOne({ _id: req.body.userId });
    if (!userCmnt)
      return res.status(500).json({ error: "Commenting user not found" });

    const notif = await Notification.create({
      postOwner: blog.userId,
      userId: req.body.userId,
      postId: blog._id,
      title: `${userCmnt.username} commented on your post`,
      subject: `${userCmnt.username} commented with: ${req.body.comment}`,
    });

    if (!notif)
      return res.status(500).json({ error: "Could not create notif" });
  }

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

    if (req.user._id !== blog.userId) {
      const userCmnt = await userModel.findOne({ _id: userId });
      if (!userCmnt)
        return res.status(500).json({ error: "reacting user not found" });

      const notif = await Notification.create({
        postOwner: blog.userId,
        userId: userId,
        postId: blog._id,
        title: `${userCmnt.username} reacted on your post`,
        subject: `${userCmnt.username} reacted with: ${reaction}`,
      });

      if (!notif)
        return res.status(500).json({ error: "Could not create notif" });
    }

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

  res.status(200).json(blog.reactions);
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

const likeComment = async (req, res) => {
  const { id } = req.params;
  const { userId, commentId } = req.body;

  try {
    const blog = await Blogs.findById(id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const commentIndex = blog.comments.findIndex(
      (comment) => comment._id == commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const comment = blog.comments[commentIndex];
    const userLikedIndex = comment.likes.findIndex(
      (like) => like.userId == userId
    );

    if (userLikedIndex === -1) {
      // User has not liked the comment yet, so add the like
      comment.likes.push({ userId });
    } else {
      // User has already liked the comment, so remove the like
      comment.likes.splice(userLikedIndex, 1);
    }

    // Save the updated blog document
    await blog.save();

    if (req.user._id !== blog.userId) {
      const userCmnt = await userModel.findOne({ _id: userId });
      if (!userCmnt)
        return res.status(500).json({ error: "reacting user not found" });

      const postOwnner = await userModel.findOne({ _id: blog.userId });
      if (!postOwnner)
        return res.status(500).json({ error: "post owner not found" });

      const notif = await Notification.create({
        postOwner: blog.userId,
        userId: userId,
        postId: blog._id,
        title: `your comment got a like`,
        subject: `${userCmnt.username} liked your comment on ${postOwnner.username}'s post`,
      });

      if (!notif)
        return res.status(500).json({ error: "Could not create notif" });
    }

    return res
      .status(200)
      .json({ error: "Comment liked/unliked successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const addReply = async (req, res) => {
  try {
    const { commentId, postId, reply, replyTo } = req.body;
    const userId = req.user._id;

    // Find the blog post by ID
    const blog = await Blogs.findById(postId);
    if (!blog) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    // Find the comment by ID within the blog post's comments array
    const comment = blog.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Create a new reply object
    const newReply = {
      userId,
      reply,
      replyTo,
    };

    // Add the new reply to the replies array
    comment.replies.push(newReply);

    // Save the updated blog post document
    await blog.save();

    if (userId !== comment.userId) {
      const replyingUser = await userModel.findOne({ _id: userId });
      if (!replyingUser)
        return res.status(500).json({ error: "replying user not found" });

      const postOwnner = await userModel.findOne({ _id: blog.userId });
      if (!postOwnner)
        return res.status(500).json({ error: "post owner not found" });

      const notif = await Notification.create({
        postOwner: comment.userId,
        userId: userId,
        postId: blog._id,
        title: `${replyingUser.username} replied on your comment`,
        subject: `${replyingUser.username} replied on your comment on ${postOwnner.username}'s post`,
      });

      if (!notif)
        return res.status(500).json({ error: "Could not create notif" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addReply };

module.exports = {
  getAllBlogs,
  getOneBlog,
  AddBlog,
  addComment,
  addReaction,
  removeReaction,
  getReactions,
  likeComment,
  addReply,
  getLatestBlogs,
};
