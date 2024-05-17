const Notification = require("../models/notificationModal");

const getUserNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find({ postOwner: req.user._id });
    res.status(200).json(notifs);
  
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteAllUserNotifications = async (req, res) => {
  try {
    const notifs = await Notification.deleteMany({ postOwner: req.user._id });
    res.status(200).json(notifs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteOneUserNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const notif = await Notification.findByIdAndDelete(id);
    res.status(200).json(notif);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const markSeen = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedDocument = await Notification.findByIdAndUpdate(
      id,
      { $set: { seen: true } },
      { new: true } // To return the updated document
    );
    if (!updatedDocument) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const makrAllSeen = async (req, res) => {
  const { user } = req.headers;

  try {
    // Update all documents associated with the user
    const result = await Notification.updateMany(
      { postOwner: user._id },
      { $set: { seen: true } }
    );

    res
      .status(200)
      .json({ message: "All documents marked as seen for user", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ eroor: "Internal server error" });
  }
};

module.exports = {
  getUserNotifications,
  deleteAllUserNotifications,
  deleteOneUserNotification,
  markSeen,
  makrAllSeen,
};
