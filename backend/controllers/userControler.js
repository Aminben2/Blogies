const User = require("../models/userModel")
const JWT = require("jsonwebtoken")

// Create Token
const createToken = (_id) => {
    return JWT.sign({ _id }, process.env.SECRET, { expiresIn: "3d" })
}

const userSignup = async (req, res) => {
    const { firstName, lastName, username, password, email } = req.body

    try {
        const user = await User.signup(username, password, firstName, lastName, email)

        // create token for user 
        const token = createToken(user._id)
        res.status(200).json({ _id: user._id, token })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const userLogin = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.login(username, password)

        // create token
        const token = createToken(user._id)

        res.status(200).json({ _id: user._id, token })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}

const getAllusers = async (req, res) => {
    const users = await User.find()

    if (!users) {
        return res.status(500).json({ error: "Users not found" })
    }

    res.status(200).json(users)
}

module.exports = {
    userLogin,
    userSignup,
    getAllusers
}