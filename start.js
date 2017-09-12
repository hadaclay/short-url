const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config({ path: ".env" });

// Connect to database
mongoose.connect(process.env.MONGOLAB_URI, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
mongoose.connection.on("error", err => {
  console.error(`ERROR: ${err.message}`);
});

const app = require("./app");
app.set("port", process.env.PORT || 3000);
const server = app.listen(app.get("port"), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
