const express = require("express");
const sensorRoute = require("./api/v1/controllers/sensorController");
const weatherRoute = require("./api/v1/controllers/weatherController");
const cityRoute = require("./api/v1/controllers/cityController");
const dataRoute = require("./api/v1/controllers/dataController");
const websiteRoute = require("./frontend/index")
const logsMiddleware = require('./api/v1/middlewares/logsService');
const checkWeatherData = require('./backend/index');
const swaggerUi = require('swagger-ui-express');
const CronJob = require('cron').CronJob;
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

require('dotenv').config()

var job = new CronJob(
    '0 */10 * * * *',
    checkWeatherData,
    null,
    true,
    'Europe/Lisbon'
);

const app = express();
const PORT = process.env.PORT || 3001;

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { authenticateUser, deserializeUser, serializeUser  } = require('./shared/auth');
const swaggerDocument = require('./api/v1/docs/swagger.json');

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'pug');
app.set('views', [
    path.join(__dirname, './frontend/views'),
    path.join(__dirname, './frontend/views/admin')
]);

app.use('/static', express.static(path.join(__dirname, './frontend/static')))
app.use(logsMiddleware);
app.use(cors({
    origin: ['192.168.0.109']
}));
app.use(express.json());
app.use(session({
    secret: 'weatherpt-test',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(authenticateUser));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

app.use('/api/v1/sensor', sensorRoute);
app.use('/api/v1/weather', weatherRoute);
app.use('/api/v1/city', cityRoute);
app.use('/api/v1/data', dataRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', websiteRoute);

app.post("/login", passport.authenticate('local', {
    successRedirect: "/dashboard",
    failureRedirect: "/login"
}))

app.post('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});


app.listen(PORT, () => {
    console.log(`Weatherpt Project is running on: http://localhost:` + PORT);
});