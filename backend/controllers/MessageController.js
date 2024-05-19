const asyncHandler = require("express-async-handler");
const Message = require("../models/MessageModel");
const User = require("../models/userModel");
const Chat = require("../models/ChatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Invalid Data Passed into Request");
    res.sendStatus(400);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "username img");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username img email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    // Create notifications for each user in the chat except the sender
    const chat = await Chat.findById(chatId).populate("users");
    const senderId = req.user._id;
    const recipients = chat.users.filter(
      (user) => user._id.toString() !== senderId.toString()
    );

    const notifications = recipients.map((user) => ({
      type: "message",
      message: `New message from ${req.user.username}`,
      chatId: chatId,
      senderId: senderId,
      isRead: false,
    }));

    await User.updateMany(
      { _id: { $in: recipients.map((user) => user._id) } },
      { $push: { notifications: { $each: notifications } } }
    );

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username img email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
