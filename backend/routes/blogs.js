const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const {
  getAllBlogs,
  getOneBlog,
  AddBlog,
  addComment,
  addReaction,
  getUserPost,
  deleteUserBlog,
  changePrivacy,
  deleteComment,
} = require("../controllers/blogsControler");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

router.get("/profile/:id", getUserPost);

router.get("/:id", getOneBlog);

router.post("/addBlog", AddBlog);

router.get("/", getAllBlogs);

router.patch("/privacy", changePrivacy);

router.patch("/delComment", deleteComment);

router.delete("/:id", deleteUserBlog);

router.patch("/:id", addComment);

router.patch("/", addReaction);

module.exports = router;
