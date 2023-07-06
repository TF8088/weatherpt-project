const express = require('express');
const weatherRoute = express.Router();

const dataSource = require('../../../database/db')

const WeatherSchema = require('../../../database/entity/weatherEntity');
const postWeatherTable = dataSource.getRepository(WeatherSchema);

// Obtém informações do Tempo por ID
// http://192.168.0.113:3001/api/v1/weather/04bfb761-8df0-4cd8-9620-e32719f038ef
weatherRoute.get('/:id', async (req, res) => {
    try {
        const sensorId = req.params.id;
        console.log(sensorId)
        // Obter informações do sensor por ID
        if (!sensorId) {
            res.status(400).send({ message: `Bad Request` })
            return
        }
        // Consulta na base de dados
        const sensorData = await postWeatherTable.find({
            where: {
                sensorId: sensorId,
            },
            order:{
                date: 'ASC'
            },
        })
        // Resposta ao pedido
        res.send({
            sensorData
        })
    } catch (err) {
        console.log(err)
        res.status(400).send({ message: `Bad Request` })
    }
});

module.exports = weatherRoute;