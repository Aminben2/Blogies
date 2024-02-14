const express = require("express");
const router = express.Router();
const {
  getUserPost,
  deleteUserBlog,
  changePrivacy,
  deleteComment,
} = require("../controllers/profileController");
const requireAuth = require("../middleware/requireAuth");

// router.use(requireAuth);

router.get("/:id", getUserPost);

router.patch("/privacy", changePrivacy);

router.patch("/delComment", deleteComment);

router.delete("/:id", deleteUserBlog);

module.exports = router;
