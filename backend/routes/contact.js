const express = require("express");

const router = express.Router();
const { addRepport } = require("../controllers/contactController");

router.post("/", addRepport);

module.exports = router;
