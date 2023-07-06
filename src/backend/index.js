require('dotenv').config()
const TeleBot = require('telebot');
const dataSource = require('../database/db')

const WeatherSchema = require('../database/entity/weatherEntity');
const postWeatherTable = dataSource.getRepository(WeatherSchema);

const SensorSchema = require('../database/entity/sensorEntity');
const postSensorTable = dataSource.getRepository(SensorSchema);


const bot = new TeleBot({
    token: process.env.BOT_TOKEN,
    usePlugins: ['commandButton']
});
try {
    bot.start();
} catch (err) {
    console.log("Err: " + err);
}

async function checkWeatherData() {
    try {
        // Pesquisar os últimos registros
        const lastRecords = await postWeatherTable.find({
            order: { date: 'DESC' },
            take: 5
        });

        if (lastRecords.length > 0) {
            const lastRecordDate = lastRecords[0].date;
            const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

            if (lastRecordDate < twoHoursAgo) {
                const cities = await postSensorTable.createQueryBuilder('sensor')
                    .leftJoinAndSelect('sensor.sensor_city', 'city')
                    .select(['sensor.name', 'sensor.ip'])
                    .getMany();

                cities.forEach((sensor) => {
                    const { name, ip } = sensor;

                    const lastRecordTime = lastRecordDate ? lastRecordDate.toLocaleTimeString() : 'N/A';

                    const messageToSend = {
                        sensorName: name,
                        sensorIP: ip,
                        lastInsertTime: lastRecordTime
                    };
                    bot.sendMessage(process.env.GROUP_ID, `Sensor Name: ${messageToSend.sensorName}
                    \nSensor IP: ${messageToSend.sensorIP}\nLast Insert: ${messageToSend.lastInsertTime}`);
                });
            }
        }
    } catch (error) {
        console.error('Erro ao verificar os dados do clima:', error);
    }
}



module.exports = checkWeatherData;