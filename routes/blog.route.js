const express = require("express");
const Router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Blog = require("../models/blog.model");

// route to create a blog
Router.post("/create", async (req, res) => {
  const { title, content } = req.body;
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    const blog = new Blog({
      title,
      content,
      author: user.name,
      author_id: user._id,
    });
    await blog.save();
    user.blogs.push(blog._id);
    await user.save();
    return res.status(200).send({
      message: "Blog created successfully",
      BlogId: blog._id,
    });
  } catch (err) {
    return res.status(401).send({ error: "Invalid token" });
  }
});

// route to update a blog
Router.put("/update", async (req, res) => {
  const id = req.body.id;
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).send({ error: "Blog not found" });
    }
    if (blog.author_id.toString() !== user._id.toString()) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    if(req.body.title) blog.title = req.body.title;
    if(req.body.content) blog.content = req.body.content;
    blog.updated_at = Date.now();
    await blog.save();
    return res.status(200).send({
      message: "Blog updated successfully",
    });
  } catch (err) {
    return res.status(401).send({ error: "Invalid token" });
  }
});


// route to delete a blog
Router.delete("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).send({ error: "Blog not found" });
    }
    if (blog.author_id.toString() !== user._id.toString()) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    const index = user.blogs.indexOf(id);
    user.blogs.splice(index, 1);
    await user.save();
    await blog.remove();
    return res.status(200).send({ message: "Blog deleted successfully" });
  } catch (err) {
    return res.status(401).send({ error: "Invalid token" });
  }
});

module.exports = Router;
