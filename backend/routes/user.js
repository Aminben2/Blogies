const express = require("express")
const router = express.Router()
const { userLogin, userSignup, getAllusers } = require("../controllers/userControler")

//Get all users

router.get("/", getAllusers)

// login
router.post("/login", userLogin)


//sign up
router.post("/signup", userSignup)


module.exports = router
