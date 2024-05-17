const express = require("express");
const {
  sendMessage,
  allMessages,
} = require("../controllers/MessageController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);
router.post("/", sendMessage);
router.get("/:chatId", allMessages);

module.exports = router;
