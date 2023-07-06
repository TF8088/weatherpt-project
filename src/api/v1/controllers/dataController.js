const express = require('express');
const dataRoute = express.Router();

const WeatherSchema = require('../../../database/entity/weatherEntity');
const SensorSchema = require('../../../database/entity/sensorEntity');
const CitySchema = require('../../../database/entity/citysEntity');

const dataSource = require('../../../database/db');
const { Between, ILike } = require('typeorm');

const postWeatherTable = dataSource.getRepository(WeatherSchema);
const postSensorTable = dataSource.getRepository(SensorSchema);
const postCityTable = dataSource.getRepository(CitySchema);

// http://192.168.0.113:3001/api/v1/data/?
dataRoute.get('/tempr/', async (req, res) => {
    try {
        const { tC, tF } = req.query;
        const ip = req.ip.replace("::ffff:", "");

        console.log({ tC, tF, ip });
        const sensor = await postSensorTable.findOne({
            where: { ip }
        });

        if (!sensor) {
            console.log(`Error: Order Placed By:${req.ip.replace("::ffff:", "")}`);
            return; // Retorna para evitar a execução do restante do código
        }

        console.log(sensor)

        const currentDate = new Date(); // #TODO
        currentDate.setSeconds(0);

        const currentDateS = new Date(currentDate) // #TODO
            .toISOString()
            .replace('T', ' ')
            .replace('Z', '')
            .substring(0, 23)
            ;

        currentDate.setSeconds(59);

        const currentDateF = new Date(currentDate) // #TODO
            .toISOString()
            .replace('T', ' ')
            .replace('Z', '')
            .substring(0, 23)
            ;

        const existingData = await postWeatherTable.findOne({
            where: {
                sensorId: sensor.id,
                date: Between(
                    currentDateS,
                    currentDateF,
                )
            }
        });

        if (existingData) {
            await postWeatherTable.update(existingData.id, {
                tempc: tC,
                tempf: tF
            });
        } else {
            await postWeatherTable.insert({
                tempc: tC,
                tempf: tF,
                sensorId: sensor.id
            });
        }
    }
    catch (err) {
        res.send("err ", err);
    }
})


module.exports = dataRoute;