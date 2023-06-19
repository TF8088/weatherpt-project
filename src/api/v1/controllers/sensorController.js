const express = require('express');
const sensorRoute = express.Router();

const { ILike } = require('typeorm');
const dataSource = require('../../../database/db')

const SensorSchema = require('../../../database/entity/sensorEntity');
const postSensorTable = dataSource.getRepository(SensorSchema);

// Obtém informações por ID
// http://192.168.1.113:3001/api/v1/sensor/04bfb761-8df0-4cd8-9620-e32719f038ef
sensorRoute.get('/:id', async (req, res) => {
    try {
        const sensorId = req.params.id;
        // Obter informações do sensor por ID
        if (!sensorId) {
            res.status(400).send({ message: `Bad Request` })
            return
        }
        // Consulta na base de dados
        const sensorData = await postSensorTable.findOne({
            where: {
                id: sensorId
            }
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

// Busca sensores por cidade
// http://192.168.1.113:3001/api/v1/sensor/?city=Alverca
sensorRoute.get('/', async (req, res) => {
    try {
        const city = req.query.city;
        console.log("New Request" + req.ip)
        // Busca de sensores por cidade
        if (!city) {
            res.status(400).send({ message: `Bad Request` })
            return
        }
        // Consulta na base de dados
        const citys = await postSensorTable.createQueryBuilder('sensor')
            .leftJoinAndSelect('sensor.sensor_city', 'city')
            .where('city.name ILike :cityName', { cityName: `%${city}%` })
            .getMany();

        const transformedResponse = citys.map((item) => {
            return {
                id: item.id,
                cityName: item.sensor_city.name,
                name: item.name
            };
        });
        // Resposta ao pedido
        res.send(
            transformedResponse
        );
    } catch (err) {
        console.log(err)
        res.status(400).send({ message: `Bad Request` })
    }
});

// Adiciona um sensor
// http://192.168.1.113:3001/api/v1/sensor/
sensorRoute.post('/', async (req, res) => {
    // Lógica para adicionar um sensor
});

// Deleta um sensor
sensorRoute.delete('/:id', async (req, res) => {
    const sensorId = req.params.id;
    // Lógica para deletar um sensor por ID
});

// Atualiza um sensor
sensorRoute.post('/:id', async (req, res) => {
    const sensorId = req.params.id;
    // Lógica para atualizar um sensor por ID
});


module.exports = sensorRoute 