const express = require("express");
const router = express.Router();
const {
  getUserPost,
  deleteUserBlog,
  changePrivacy,
  deleteComment,
  pinComment,
  apreciateComment,
} = require("../controllers/profileController");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

router.get("/:id", getUserPost);

router.patch("/:id/privacy", changePrivacy);

router.patch("/:id/delComment", deleteComment);

router.patch("/:id/pinComment", pinComment);

router.patch("/:id/apreciateComment", apreciateComment);

router.delete("/:id", deleteUserBlog);

module.exports = router;
