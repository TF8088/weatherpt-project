const express = require("express"); 
const bodyParser = require("body-parser");
const sensorRoute = require("./api/v1/controllers/sensorController");
const weatherRoute = require("./api/v1/controllers/weatherController");

const logsMiddleware = require('./api/v1/middlewares/logsService');
const cors = require('cors');
const path = require('path');

const app = express(); 
const PORT = process.env.PORT || 3001; 


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './frontend/views'));
app.use('/static', express.static(path.join(__dirname, './frontend/static')))

app.use(logsMiddleware);
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
    origin: ['http://192.168.1.155', '192.168.0.110']
}));

app.use('/api/v1/sensor', sensorRoute);
app.use('/api/v1/weather', weatherRoute);

app.get("/", (req, res) => {

    const sensor = req.ip
    console.log(sensor);
    res.render("home");
});

app.get("/city", async (req, res) => {
    const sensor = req.query.sensor
    res.render("city",  { sensor: sensor });
})

app.listen(PORT, () => {
    console.log(`Weatherpt API is running on: http://localhost:` + PORT);
});