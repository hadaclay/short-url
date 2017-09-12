const mongoose = require("mongoose");
const URLModel = require("../models/URLModel");

function isValidURL(url) {
  const regex = new RegExp(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\//=]*)/
  );
  return regex.test(url);
}

function generateShortID() {
  return Math.random()
    .toString(36)
    .substr(2, 5);
}

exports.handleNewURL = async (req, res) => {
  const originalURL = req.originalUrl.substr(5); // Remove /new/ from url

  // Check URL validity
  if (isValidURL(originalURL) === false) {
    return res.json({ error: "Invalid URL Supplied" });
  }

  // Check if URL already in DB, if so, return it
  try {
    const existingURL = await URLModel.findOne({ fullURL: originalURL });
    if (existingURL !== null) {
      return res.json({
        original_url: existingURL.fullURL,
        short_url: `${req.get("host")}/${existingURL.shortID}`
      });
    }
  } catch (e) {
    console.error(e);
  }

  // Create and return new URL
  try {
    const shortID = generateShortID();
    const urlDoc = await new URLModel({
      fullURL: originalURL,
      shortID
    }).save();

    return res.json({
      original_url: originalURL,
      short_url: `${req.get("host")}/${shortID}`
    });
  } catch (e) {
    console.error(e);
  }
};

exports.handleRedirect = async (req, res) => {
  const { shortID } = req.params;

  // Find shortID in DB
  const urlDoc = await URLModel.findOne({ shortID });
  if (urlDoc === null) {
    return res.json({ error: "Invalid Redirect ID" });
  }

  return res.redirect(urlDoc.fullURL);
};
