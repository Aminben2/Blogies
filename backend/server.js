require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: "POST,GET,PUT,PATCH,OPTiONS,DELETE,HEAD",
    credentials: true,
  })
);

// Routes :
const blogsRouter = require("./routes/blogs");
const userRouter = require("./routes/user");
const contactRouter = require("./routes/contact");
const profileRouter = require("./routes/profile");

// connect to database
mongoose
  .connect(process.env.dbURL)
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((err) => console.log(err));
app.use(express.static("public"));

app.use("/api/blogs", blogsRouter);
app.use("/api/users", userRouter);
app.use("/api/contact", contactRouter);
app.use("/api/profile", profileRouter);
