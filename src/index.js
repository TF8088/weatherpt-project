const express = require("express");
const bodyParser = require("body-parser");
const sensorRoute = require("./api/v1/controllers/sensorController");
const weatherRoute = require("./api/v1/controllers/weatherController");
const websiteRoute = require("./frontend/index")
const logsMiddleware = require('./api/v1/middlewares/logsService');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { userAuthenticate, deserializeUser, serializeUser  } = require('./shared/auth');

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
app.use('/', websiteRoute);

/* Website */

// app.use(session({
//     secret: 'weatherpt-test',
//     resave: true,
//     saveUninitialized: true
// }))

// const Strategy = new LocalStrategy(userAuthenticate);z
// passport.use(Strategy);
// app.use(passport.initialize());
// app.use(passport.session());
// passport.serializeUser(myserialize());
// passport.deserializeUser(mydeseriSalize());

// app.post('/login',
//   passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }), 
//   (err, req, res, next) => {
//     if (err) next(err);  
// });

app.listen(PORT, () => {
    console.log(`Weatherpt Project is running on: http://localhost:` + PORT);
});