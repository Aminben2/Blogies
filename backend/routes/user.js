const express = require("express");
const router = express.Router();
const {
  userLogin,
  userSignup,
  getAllusers,
  getUser,
  updateProfilePic,
  updateProfileCover,
  getUsers,
} = require("../controllers/userControler");
const requireAuth = require("../middleware/requireAuth");
const userModel = require("../models/userModel");

//Get all users

router.get("/", requireAuth, getAllusers);

router.get("/notifications", requireAuth, async (req, res) => {
  try {
    const userId = req.user._id; // Assume user ID is available in req.user
    const user = await userModel
      .findById(userId)
      .populate("notifications.senderId", "username");
    res.status(200).json(user.notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/all", requireAuth, getUsers);

router.get("/oneUser/:id", requireAuth, getUser);

// login
router.post("/login", userLogin);

//sign up
router.post("/signup", userSignup);

router.patch("/:id/profilePic", requireAuth, updateProfilePic);

router.patch("/:id/profileCover", requireAuth, updateProfileCover);

router.delete("/notifications", requireAuth, async (req, res) => {
  const { chatId } = req.body;

  if (!chatId) {
    return res.status(400).json({ error: "Chat ID is required" });
  }

  try {
    await userModel.updateOne(
      { _id: req.user._id },
      { $pull: { notifications: { chatId: chatId } } }
    );
    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
