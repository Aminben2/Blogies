const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const validator = require("validator");

const notificationSchema = new mongoose.Schema(
  {
    type: String,
    message: String,
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const workSchema = new mongoose.Schema({
  company: String,
  position: String,
  startDate: Date,
  endDate: Date,
  current: Boolean,
  desc: String,
});

const educationSchema = new mongoose.Schema({
  school: String,
  degree: String,
  fieldOfStudy: String,
  startDate: Date,
  endDate: Date,
  current: Boolean,
  desc: String,
});

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  socialLinks: {
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    instagram: { type: String, default: "" },
  },
  cover: {
    type: String,
    default: "",
  },
  dateOfBirth: {
    type: Date,
  },
  work: [workSchema],
  education: [educationSchema],
  contactInfo: {
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    website: { type: String, default: "" },
  },

  notifications: [notificationSchema],
});

userSchema.statics.login = async function (username, password) {
  if (!password || !username) {
    throw Error("All fields required");
  }
  const user = await this.findOne({ username: username });
  if (!user) {
    throw Error("Username/password is incorrect");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Username/password is incorrect");
  }
  return user;
};

userSchema.statics.signup = async function (
  username,
  password,
  firstName,
  lastName,
  email
) {
  const existUsername = await this.findOne({ username: username });
  const existEmail = await this.findOne({ email: email });

  // Validation
  if (!username || !password || !firstName || !lastName || !email) {
    throw Error("All fields required");
  }

  if (existUsername) {
    throw Error("Acount already existe");
  }
  if (existEmail) {
    throw Error("Acount already existe");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email invalid, Try again");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Weak Password");
  }
  if (!validator.isAlpha(lastName)) {
    throw Error("Last name is invalid, Only characters");
  }
  if (!validator.isAlpha(firstName)) {
    throw Error("Fisrt name is invalid, Only characters");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPasswod = await bcrypt.hash(password, salt);

  const user = await this.create({
    username,
    password: hashedPasswod,
    firstName,
    lastName,
    email,
  });
  return user;
};

module.exports = mongoose.model("User", userSchema);
