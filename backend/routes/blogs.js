const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/blogsControler");
const requireAuth = require("../middleware/requireAuth");

router.get("/:id", requireAuth, getOneBlog);

router.get("/:id/reactions", requireAuth, getReactions);

router.get("/", requireAuth, getAllBlogs);

router.get("/latest/all", getLatestBlogs);

router.post("/", requireAuth, AddBlog);

router.patch("/addReply", requireAuth, addReply);

router.patch("/:id", requireAuth, addComment);

router.patch("/:id/react", requireAuth, addReaction);

router.patch("/:id/unReact", requireAuth, removeReaction);

router.patch("/:id/likeComment", requireAuth, likeComment);

module.exports = router;
