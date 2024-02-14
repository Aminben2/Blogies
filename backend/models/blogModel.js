const mongoose = require("mongoose")
const Schema = mongoose.Schema

const commentSchema = new Schema({
    commentId: String,
    userId: String,
    comment: String,
}, { timestamps: true })

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    reactions: {
        type: Object,
        required: true
    },
    img: {
        type: String,
        required: false
    },
    comments: {
        type: [commentSchema],
        default: []
    },
    private: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("Blogs", blogSchema)

