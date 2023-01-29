const mongoose = require("mongoose");

const Blog = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        author_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        created_at: {
            type: Date,
            required: true,
            default: Date.now,
        },
        updated_at: {
            type: Date,
            required: true,
            default: Date.now,
        }
    },
    { collection: "blog" }
);

const model = mongoose.model("Blog", Blog);

module.exports = model;