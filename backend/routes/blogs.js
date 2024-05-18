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
} = require("../controllers/blogsControler");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

router.get("/:id", getOneBlog);

router.get("/:id/reactions", getReactions);

router.post("/", AddBlog);

router.get("/", getAllBlogs);

router.patch("/addReply", addReply);

router.patch("/:id", addComment);

router.patch("/:id/react", addReaction);

router.patch("/:id/unReact", removeReaction);

router.patch("/:id/likeComment", likeComment);

module.exports = router;
