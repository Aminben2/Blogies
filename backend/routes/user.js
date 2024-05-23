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
  updateContactInfo,
  userNotifications,
  deleteAllNotifs,
  deleteWork,
  addWork,
  addEducation,
  deleteEducation,
  updateBio,
  updatePersonnalInfo,
} = require("../controllers/userControler");
const requireAuth = require("../middleware/requireAuth");

//Get all users

router.get("/", requireAuth, getAllusers);

router.get("/notifications", requireAuth, userNotifications);

router.get("/all", requireAuth, getUsers);

router.get("/oneUser/:id", getUser);

// login
router.post("/login", userLogin);

//sign up
router.post("/signup", userSignup);

router.post("/addWork", requireAuth, addWork);

router.post("/addEducation", requireAuth, addEducation);

router.patch("/:id/profilePic", requireAuth, updateProfilePic);

router.patch("/:id/profileCover", requireAuth, updateProfileCover);

router.patch("/updateBio", requireAuth, updateBio);

router.patch("/info", requireAuth, updatePersonnalInfo);

router.patch("/contactInfo", requireAuth, updateContactInfo);

router.delete("/notifications", requireAuth, deleteAllNotifs);

router.delete("/work/:id", requireAuth, deleteWork);

router.delete("/education/:id", requireAuth, deleteEducation);

module.exports = router;
