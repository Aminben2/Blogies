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

//Get all users

router.get("/:id", getUser);

router.get("/", getAllusers);

// login
router.post("/login", userLogin);

//sign up
router.post("/signup", userSignup);

router.patch("/:id/profilePic", updateProfilePic);

router.patch("/:id/profileCover", updateProfileCover);

module.exports = router;
