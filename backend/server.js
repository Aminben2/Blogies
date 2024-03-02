require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();

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

// connect to database
mongoose
  .connect(process.env.dbURL)
  .then(() => {
    app.listen(process.env.PORT);
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
  // You can access the file information through req.files
  // Perform any necessary processing or validation here
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

app.use("/api/blogs", blogsRouter);
app.use("/api/users", userRouter);
app.use("/api/contact", contactRouter);
app.use("/api/profile", profileRouter);
app.use("/api/categories", categoriesRouter);
