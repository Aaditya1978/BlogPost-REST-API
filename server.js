require('dotenv').config();
const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth.route");
const blogRoute = require("./routes/blog.route");
const Blog = require("./models/blog.model");

// Create express app
const app = express();
app.use(express.json());
app.use(cors());

// connect to database
const dbUrl = "mongodb://localhost:27017/BlogPost"
mongoose.connect(dbUrl, {useNewUrlParser: true});

// route middlewares
app.use("/api", authRoute);
app.use("/api", blogRoute);

// default route
app.get("/", async (req, res) => {
    if(req.query.page){
        const data = await Blog.find({}).skip(10 * (req.query.page - 1)).limit(10);
        res.status(200).send({data: data});
    }else{
        const data = await Blog.find({}).limit(10);
        res.status(200).send({data: data});
    }
});

// start server
app.listen(5000, () => {
    console.log("Server started on port 5000");
});