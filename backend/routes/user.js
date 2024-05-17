const express = require("express");
const router = express.Router();
const {
  userLogin,
  userSignup,
  getAllusers,
  getUser,
  updateProfilePic,
  updateProfileCover,
} = require("../controllers/userControler");
const requireAuth = require("../middleware/requireAuth");

//Get all users

router.get("/", requireAuth, getAllusers);

router.get("/:id", requireAuth, getUser);

// login
router.post("/login", userLogin);

//sign up
router.post("/signup", userSignup);

router.patch("/:id/profilePic", requireAuth, updateProfilePic);

router.patch("/:id/profileCover", requireAuth, updateProfileCover);

module.exports = router;
