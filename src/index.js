const express = require("express");
const bodyParser = require("body-parser");
const sensorRoute = require("./api/v1/controllers/sensorController");
const weatherRoute = require("./api/v1/controllers/weatherController");

const logsMiddleware = require('./api/v1/middlewares/logsService');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { serializeUser, deserializeUser, userAuthenticate } = require('./shared/auth');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './frontend/views'));
app.use('/static', express.static(path.join(__dirname, './frontend/static')))

app.use(logsMiddleware);
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
    origin: ['192.168.1.155', '192.168.0.110']
}));


app.use('/api/v1/sensor', sensorRoute);
app.use('/api/v1/weather', weatherRoute);

/* Website */

app.use(session({
    secret: 'weatherpt-test',
    resave: true,
    saveUninitialized: true
}))

const Strategy = new LocalStrategy(userAuthenticate);

passport.use(Strategy);
passport.serializeUser(serializeUser());
passport.deserializeUser(deserializeUser());
app.use(initialize());
app.use(session());

app.get("/", (req, res) => {
    res.render("home");
});
app.get("/city", async (req, res) => {
    const sensor = req.query.sensor
    res.render("city", { sensor: sensor });
})
app.get("/login", async (req, res) => {
    res.render("login");
})
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }), 
  (err, req, res, next) => {
    if (err) next(err);  
});
app.listen(PORT, () => {
    console.log(`Weatherpt Project is running on: http://localhost:` + PORT);
});