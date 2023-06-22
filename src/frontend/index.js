const express = require('express');

const websiteRoute = express.Router();

websiteRoute.get("/", (req, res) => {
    res.render("home");
});
websiteRoute.get("/city", async (req, res) => {
    const sensor = req.query.sensor
    res.render("city", { sensor: sensor });
})
websiteRoute.get("/login", async (req, res) => {
    res.render("login");
})

module.exports = websiteRoute;