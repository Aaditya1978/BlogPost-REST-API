const express = require("express");
const Router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const TokenModel = require("../models/token.model");
const send_reset_mail = require("../utils/mail");

const saltRounds = 10;

// route to register a new user
Router.post("/register", async(req, res) => {
    const {name, email, password} = req.body;

    const user = await User.findOne({email});
    if(user){
        return res.status(400).send({error: "User already exists"});
    }
    bcrypt.hash(password, saltRounds, async(err, hash) => {
        if(err){
            return res.status(500).send({error: "Internal server error"});
        }
        try{
            const newUser = await User.create({name, email, password: hash});
            const token = jwt.sign({_id: newUser._id}, process.env.JWT_SECRET, {expiresIn: "6h"});
            return res.status(201).send({message: "User created successfully", token: token});
        }
        catch(err){
            return res.status(500).send({error: "Internal server error"});
        }
    });
});

// route to login a user
Router.post("/login", async(req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user){
        return res.status(404).send({error: "User not found"});
    }
    bcrypt.compare(password, user.password, async(err, result) => {
        if(err){
            return res.status(500).send({error: "Internal server error"});
        }
        if(!result){
            return res.status(401).send({error: "Invalid credentials"});
        }
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "6h"});
        return res.status(200).send({token: token});
    });
});

// route to reset password
Router.post("/reset_password", async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(404).send({error: "User not found"});
    }
    const token = await TokenModel.findOne({user_id: user._id});
    if(token){
        return res.status(400).send({error: "Password reset link already sent to your email"});
    }
    const tempToken = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "10m"});
    bcrypt.hash(tempToken, saltRounds, async(err, hash) => {
        if(err){
            return res.status(500).send({error: "Internal server error"});
        }
        try{
            await TokenModel.create({user_id: user._id, token: hash});
            const link = `http://localhost:5000/api/reset_password/${tempToken}?new_password=${password}`;
            await send_reset_mail(user.email, link);
            return res.status(200).send({message: "Password reset link sent to your email"});
        }
        catch(err){
            return res.status(500).send({error: "Internal server error"});
        }
    });
});

// route to verify reset password link
Router.get("/reset_password/:token", async(req, res) => {
    const {token} = req.params;
    const new_password = req.query.new_password;
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const tempToken = await TokenModel.findOne({user_id: decoded._id});
        if(!tempToken){
            return res.status(401).send({error: "Invalid link"});
        }
        bcrypt.compare(token, tempToken.token, async(err, result) => {
            if(err){
                return res.status(500).send({error: "Internal server error"});
            }
            if(!result){
                return res.status(401).send({error: "Invalid link"});
            }
            bcrypt.hash(new_password, saltRounds, async(err, hash) => {
                if(err){
                    return res.status(500).send({error: "Internal server error"});
                }
                try{
                    await User.updateOne({_id: decoded._id}, {password: hash});
                    await TokenModel.deleteOne({user_id: decoded._id});
                    return res.status(200).send({message: "Password reset successful"});
                }
                catch(err){
                    return res.status(500).send({error: "Internal server error"});
                }
            });
        });
    }
    catch(err){
        return res.status(401).send({error: "Invalid link"});
    }
});

module.exports = Router;