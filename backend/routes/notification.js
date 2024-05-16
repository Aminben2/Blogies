const express = require("express");
const {
  getUserNotifications,
  deleteAllUserNotifications,
  deleteOneUserNotification,
  markSeen,
  makrAllSeen,
} = require("../controllers/NotificationController");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();

router.use(requireAuth);
router.get("/", getUserNotifications);
router.put("/:id/markSeen", markSeen);
router.put("/markAllSeen", makrAllSeen);
router.delete("/", deleteAllUserNotifications);
router.delete("/:id", deleteOneUserNotification);

module.exports = router;
