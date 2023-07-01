// 6161509599:AAHMHBeL0gwWG58yru2P-QyVDPKNArXGtsM
const dataSource = require('../database/db')

const WeatherSchema = require('../database/entity/weatherEntity');
const postWeatherTable = dataSource.getRepository(WeatherSchema);

const checkWeatherData = () => {
    console.log("Test")
}

setInterval(checkWeatherData, 10000)

module.export = { checkWeatherData };