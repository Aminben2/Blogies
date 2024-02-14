// let database;
// connectToDb((err) => {
//     if (!err) {
//         app.listen(process.env.PORT)
//         database = getDb()
//     }
// })

// Blog route
// app.get("/api/blogs/:id", (req, res) => {
//     if (ObjectId.isValid(req.params.id)) {
//         database.collection("blogs")
//             .findOne({ _id: new ObjectId(req.params.id) })
//             .then(blog => res.status(200).json(blog))
//             .catch(err => res.status(500).json({ error: "Blog is not found" }))
//     } else {
//         res.status(500).json({ error: "Blog id is inavlid" })
//     }
// })

// blog Route add comment
// app.patch("/api/blogs/:id", (req, res) => {
//     const comment = req.body
//     if (ObjectId.isValid(req.params.id)) {
//         database.collection("blogs")
//             .updateOne(
//                 {
//                     _id: new ObjectId(req.params.id)
//                 },
//                 { $push: { comments: comment } })
//             .then(blog => res.status(200).json(blog))
//             .catch(err => res.status(500).json({ error: "The comment was not added" }))
//     } else {
//         res.status(500).json({ error: "Blog id is inavlid" })
//     }
// })

// Add Blog route
// app.post("/api/blogs/addBlog", (req, res) => {
//     const blog = req.body

//     database.collection("blogs")
//         .insertOne(blog)
//         .then(result => res.status(200).json(result))
//         .catch(err => res.status(500).json({ error: "Could not add the blog" }))
// })

// app.get("/api/users", (req, res) => {
//     let users = []
//     database.collection("users").find()
//         .forEach(user => users.push(user))
//         .then(result => res.status(200).json(users))
//         .catch(err => res.status(500).json({ error: "Could Not fetch the users from databse" }))
// })

/// Blogs route
// app.get("/api/blogs", (req, res) => {
//     let blogs = []
//     database.collection("blogs").find()
//         .forEach(blog => blogs.push(blog))
//         .then(result => res.status(200).json(blogs))
//         .catch(err => res.status(500).json({ error: "Could not fetch data from databse" }))
// })

// const bcrypt = require("bcryptjs")
// const func=async()=>{

// const salt =await  bcrypt.genSalt(10);
// const hashedPasswod = await  bcrypt.hash("password", salt);
// console.log(hashedPasswod);
// }

// func()
