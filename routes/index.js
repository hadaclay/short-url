const express = require("express");
const router = express.Router();

const urlController = require("../controllers/urlController");

router.get("/new", (req, res) => res.json({ error: "No URL Specefied" }));
router.get("/:shortID?", urlController.handleRedirect);
router.get("/new/:url(*)", urlController.handleNewURL);

module.exports = router;
