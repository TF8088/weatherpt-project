const express = require('express');

const websiteRoute = express.Router();


chechAuthenticated = (req, res, next) => {
    if (req && req.isAuthenticated()) {
        return next()
    } 
    res.redirect("/login")
}

websiteRoute.get("/", (req, res) => {
    res.render("home");
});
websiteRoute.get("/city", (req, res) => {
    const sensor = req.query.sensor
    res.render("city", { sensor: sensor });
});
websiteRoute.get("/login", (req, res) => {
    res.render("login");
});
websiteRoute.get("/dashboard", chechAuthenticated, (req, res) => {
    res.render("dashboard");
});
websiteRoute.get("/dashboard/sensor", chechAuthenticated, (req, res) => {
    res.render("sensor");
});
module.exports = websiteRoute;