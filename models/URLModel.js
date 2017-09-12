const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const urlSchema = new mongoose.Schema({
  fullURL: {
    type: String,
    required: true
  },
  shortID: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("URLModel", urlSchema);
