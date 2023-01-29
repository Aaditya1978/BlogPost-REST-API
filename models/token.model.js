const mongoose = require("mongoose");

const Token = new mongoose.Schema(
  {
    token: {
        type: String,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
  },
  { collection: "token" }
);

const model = mongoose.model("Token", Token);

module.exports = model;