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

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "Users not found" });
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

const deleteAllNotifs = async (req, res) => {
  const { chatId } = req.body;

  if (!chatId) {
    return res.status(400).json({ error: "Chat ID is required" });
  }

  try {
    await User.updateOne(
      { _id: req.user._id },
      { $pull: { notifications: { chatId: chatId } } }
    );
    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const userNotifications = async (req, res) => {
  try {
    const userId = req.user._id; // Assume user ID is available in req.user
    const user = await User.findById(userId).populate(
      "notifications.senderId",
      "username"
    );
    res.status(200).json(user.notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

const updateContactInfo = async (req, res) => {
  try {
    const { phone, address, website, dateOfBirth } = req.body;

    // Construct the update object dynamically
    const updateFields = {};
    if (phone !== "" && phone !== undefined)
      updateFields["contactInfo.phone"] = phone;
    if (address !== "" && address !== undefined)
      updateFields["contactInfo.address"] = address;
    if (website !== "" && website !== undefined)
      updateFields["contactInfo.website"] = website;
    if (dateOfBirth !== "" && dateOfBirth !== undefined)
      updateFields.dateOfBirth = dateOfBirth;

    // Perform the update
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true } // returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addWork = async (req, res) => {
  try {
    const { company, position, startDate, endDate, current, desc } = req.body;

    // Validate required fields
    if (!company || !position || !startDate || !desc) {
      return res
        .status(400)
        .json({ message: "Company, position, and startDate are required" });
    }

    // Create the new work experience object
    const newWork = {
      company,
      position,
      startDate,
      endDate,
      current: !endDate || current ? true : false,
      desc,
    };

    // Find the user and add the new work experience
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { work: newWork } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteWork = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    // Find the user and pull the work experience by id
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { work: { _id: id } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addEducation = async (req, res) => {
  try {
    const { school, degree, fieldOfStudy, startDate, endDate, current, desc } =
      req.body;

    // Validate required fields
    if (!school || !degree || !startDate || !fieldOfStudy || !desc) {
      return res
        .status(400)
        .json({ error: "School, degree, and startDate are required" });
    }

    // Create the new education entry object
    const newEducation = {
      school,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      current: !endDate || current ? true : false,
      desc,
    };

    // Find the user and add the new education entry
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { education: newEducation } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    // Find the user and pull the education entry by id
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { education: { _id: id } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateBio = async (req, res) => {
  try {
    const { bio } = req.body;

    if (!bio) {
      return res.status(400).json({ error: "Bio is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { bio: bio } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePersonnalInfo = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    // Construct the update object dynamically
    const updateFields = {};
    if (firstName !== "" && firstName !== undefined)
      updateFields.firstName = firstName;
    if (lastName !== "" && lastName !== undefined)
      updateFields.lastName = lastName;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  userLogin,
  userSignup,
  getAllusers,
  getUser,
  updateProfilePic,
  updateProfileCover,
  getUsers,
  updateContactInfo,
  deleteAllNotifs,
  userNotifications,
  addWork,
  deleteWork,
  addEducation,
  deleteEducation,
  updateBio,
  updatePersonnalInfo,
};
