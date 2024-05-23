require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
const JWT = require("jsonwebtoken");

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: "POST,GET,PUT,PATCH,OPTiONS,DELETE,HEAD",
    credentials: true,
  })
);

// Routes :
const blogsRouter = require("./routes/blogs");
const userRouter = require("./routes/user");
const contactRouter = require("./routes/contact");
const profileRouter = require("./routes/profile");
const categoriesRouter = require("./routes/category");
const notificationRouter = require("./routes/notification");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");
const User = require("./models/userModel");

// connect to database

mongoose
  .connect(process.env.dbURL)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => console.log(err));
app.use(express.static("public"));

const uploadsDirectory = path.join(__dirname, "uploads");

// Create the "uploads" directory if it doesn't exist
if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory);
}

// Set up Multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDirectory); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Endpoint for multiple file uploads
app.post("/upload", upload.array("files", 10), (req, res) => {
  // Everything went fine.
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files were uploaded." });
  }
  const filenames = req.files.map((file) => file.filename);
  res.status(200).json({ url: filenames });
});

// app.post("/upload", upload.single("file"), (req, res) => {
//   // You can access the file information through req.file
//   // Perform any necessary processing or validation here
//   console.log(req.file);
//   const filename = req.file.filename;

//   res.status(200).json({ url: filename });
// });

app.use("/uploads", express.static(uploadsDirectory));

// Token validation endpoint
app.post("/validate-token", async (req, res) => {
  const token = req.body.token;
  try {
    const decoded = JWT.verify(token, process.env.SECRET);
    const user = await User.findById(decoded._id);
    if (user) {
      return res.status(200).json({ valid: true });
    } else {
      return res.status(401).json({ valid: false, message: "User not found" });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ valid: false, message: "Token expired" });
    } else {
      return res.status(401).json({ valid: false, message: "Invalid token" });
    }
  }
});

app.use("/api/blogs", blogsRouter);
app.use("/api/users", userRouter);
app.use("/api/contact", contactRouter);
app.use("/api/profile", profileRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const server = app.listen(process.env.PORT, () =>
  console.log("Server Stated on " + process.env.PORT)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to Socket.io !!");

  socket.on("setup", (userData) => {
    if (!userData || !userData._id) {
      console.log("Invalid user data received");
      return; // Early return if userData is invalid
    }
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("Room joined: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not found !!");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED !");
    socket.leave(userData._id);
  });
});
