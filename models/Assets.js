const mongoose = require("mongoose");

const assetsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Assets = mongoose.model("Assets", assetsSchema);

module.exports = { Assets };
