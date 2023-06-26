const express = require('express');
const sensorRoute = express.Router();

const dataSource = require('../../../database/db')
const { ILike } = require('typeorm');

const SensorSchema = require('../../../database/entity/sensorEntity');
const postSensorTable = dataSource.getRepository(SensorSchema);

const CitySchema = require('../../../database/entity/citysEntity');
const postCityTable = dataSource.getRepository(CitySchema);

// Pesquisa de Todos os sensores mais cidade 
sensorRoute.get('/', async (req, res) => {
  try {
    const sensors = await postSensorTable.createQueryBuilder('sensor')
      .leftJoinAndSelect('sensor.sensor_city', 'city')
      .getMany();

    const transformedResponse = sensors.map((sensor) => {
      return {
        id: sensor.id,
        name: sensor.name,
        ip: sensor.ip,
        cityName: sensor.sensor_city.name
      };
    });

    res.send(transformedResponse);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: 'Bad Request' });
  }
});

// Obtém informações por ID
sensorRoute.get('/:id', async (req, res) => {
  try {
    const sensorId = req.params.id;
    // Obter informações do sensor por ID
    if (!sensorId) {
      res.status(400).send({ message: 'Bad Request' });
      return;
    }
    // Consulta na base de dados
    const sensorData = await postSensorTable.findOne({
      where: {
        id: sensorId
      }
    });
    // Resposta ao pedido
    res.send({
      sensorData
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: 'Bad Request' });
  }
});

// Busca sensores por cidade
sensorRoute.get('/search/:city', async (req, res) => {
  try {
    const city = req.params.city;
    console.log('New Request' + req.ip);
    // Busca de sensores por cidade
    if (!city) {
      res.status(400).send({ message: 'Bad Request' });
      return;
    }
    // Consulta na base de dados
    const cities = await postSensorTable.createQueryBuilder('sensor')
      .leftJoinAndSelect('sensor.sensor_city', 'city')
      .where('city.name ILike :cityName', { cityName: `%${city}%` })
      .getMany();

    console.log(city)
    const transformedResponse = cities.map((item) => {
      return {
        id: item.id,
        cityName: item.sensor_city.name,
        name: item.name
      };
    });
    // Resposta ao pedido
    res.send(transformedResponse);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: 'Bad Request' });
  }
});

// Adiciona um sensor
sensorRoute.post('/', async (req, res) => {
  try {
    const { name, ip, cityName } = req.body;

    // Verificar se a cidade já existe
    const existingCity = await postCityTable.findOne({
      where: {
        name: cityName
      }
    });

    console.log(existingCity);

    if (!existingCity) {
      // Criar uma nova cidade
      const newCity = postCityTable.create({
        name: cityName
      });
      // Salvar a nova cidade 
      const savedCity = await postCityTable.save(newCity);
      const cityId = savedCity.id;

      // Criar um novo sensor relacionado à cidade
      const newSensor = postSensorTable.create({ name, ip, cityId });
      // Salvar o novo sensor 
      const savedSensor = await postSensorTable.save(newSensor);

      console.log('Sensor and City saved:', savedSensor, savedCity);
    } else {
      const cityId = existingCity.id;

      // Criar um novo sensor relacionado à cidade existente
      const newSensor = postSensorTable.create({ name, ip, cityId });
      // Salvar o novo sensor 
      const savedSensor = await postSensorTable.save(newSensor);

      console.log('Sensor saved:', savedSensor);
    }

    res.send({ message: 'Sensor saved successfully' });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: 'Bad Request' });
  }
});


// Deleta um sensor
sensorRoute.delete('/:id', async (req, res) => {
  const sensorId = req.params.id;
  // Lógica para deletar um sensor por ID
});

// Atualiza um sensor
sensorRoute.put('/:id', async (req, res) => {
  const sensorId = req.params.id;
  // Lógica para atualizar um sensor por ID
});

module.exports = sensorRoute;