const { default: mongoose } = require("mongoose");
const User = require("../models/userModel");
const JWT = require("jsonwebtoken");

// Create Token
const createToken = (_id) => {
  return JWT.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const userSignup = async (req, res) => {
  const { firstName, lastName, username, password, email } = req.body;

  try {
    const user = await User.signup(
      username,
      password,
      firstName,
      lastName,
      email
    );

    // create token for user
    const token = createToken(user._id);
    res.status(200).json({
      _id: user._id,
      token,
      username: user.username,
      email: user.email,
      img: user.img,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const userLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);

    // create token
    const token = createToken(user._id);

    res
      .status(200)
      .json({
        _id: user._id,
        token,
        username: user.username,
        email: user.email,
        img: user.img,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllusers = async (req, res) => {
  const searchRegex = new RegExp(req.query.search, "i");
  const keyword = req.query.search
    ? {
        $or: [
          { firstName: { $regex: searchRegex } },
          { lastName: { $regex: searchRegex } },
          { username: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  if (!users) {
    return res.status(500).json({ error: "Users not found" });
  }

  res.status(200).json(users);
};

const getUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(501).json({ error: "User id is not valid" });
  }
  const user = await User.findOne({ _id: id });
  if (!user) {
    res.status(500).json({ error: "User not found" });
  }
  res.status(200).json(user);
};

const updateProfilePic = async (req, res) => {
  const { id } = req.params;
  const { imageUrl } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(501).json({ error: "User id is not valid" });
  }

  const user = await User.findByIdAndUpdate(
    { _id: id },
    { $set: { img: imageUrl } },
    { new: true }
  );

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }
  res.status(200).json(user);
};
const updateProfileCover = async (req, res) => {
  const { id } = req.params;
  const { imageUrl } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(501).json({ error: "User id is not valid" });
  }

  const user = await User.findByIdAndUpdate(
    { _id: id },
    { $set: { cover: imageUrl } },
    { new: true }
  );

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }
  res.status(200).json(user);
};

module.exports = {
  userLogin,
  userSignup,
  getAllusers,
  getUser,
  updateProfilePic,
  updateProfileCover,
};
