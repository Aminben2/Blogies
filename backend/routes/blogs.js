const express = require("express");
const router = express.Router();
const path = require("path");

const {
  getAllBlogs,
  getOneBlog,
  AddBlog,
  addComment,
  addReaction,
} = require("../controllers/blogsControler");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

router.get("/:id", getOneBlog);

router.post("/", AddBlog);

router.get("/", getAllBlogs);

router.patch("/:id", addComment);

router.patch("/", addReaction);

module.exports = router;
