const express = require('express');
const sensorRoute = express.Router();

const dataSource = require('../../../database/db')
const { ILike } = require('typeorm');

const SensorSchema = require('../../../database/entity/sensorEntity');
const postSensorTable = dataSource.getRepository(SensorSchema);

const CitySchema = require('../../../database/entity/citysEntity');
const postCityTable = dataSource.getRepository(CitySchema);

chechAuthenticated = (req, res, next) => {
  if (req && req.isAuthenticated()) {
      return next()
  } 
  res.redirect("/")
}

// Pesquisa de Todos os sensores mais cidade 
sensorRoute.get('/', async (req, res) => {
  try {
    const sensors = await postSensorTable.createQueryBuilder('sensor')
      .leftJoinAndSelect('sensor.sensor_city', 'city')
      .orderBy('sensor.status', 'DESC') 
      .getMany();

    const transformedResponse = sensors.map((sensor) => {
      return {
        id: sensor.id,
        name: sensor.name,
        ip: sensor.ip,
        cityName: sensor.sensor_city.name,
        status: sensor.status
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
      },
      relations: ['sensor_city'] // Incluir a relação "sensor_city"
    });
    // Resposta ao pedido
    res.send(sensorData);
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
sensorRoute.post('/', chechAuthenticated, async (req, res) => {
  try {
    const { name, ip, cityName } = req.body;
    // Verificar se a cidade já existe
    const existingCity = await postCityTable.findOne({
      where: {
        name: cityName
      }
    });
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
    } else {
      const cityId = existingCity.id;
      // Criar um novo sensor relacionado à cidade existente
      const newSensor = postSensorTable.create({ name, ip, cityId });
      // Salvar o novo sensor 
      const savedSensor = await postSensorTable.save(newSensor);
    }
    res.send({ message: 'Sensor saved successfully' });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: 'Bad Request' });
  }
});


// Remove um sensor
sensorRoute.delete('/:id', chechAuthenticated, async (req, res) => {
  try {
    const sensorId = req.params.id;
    // Verificar se o ID do sensor foi fornecido
    if (!sensorId) {
      res.status(400).send({ message: 'Bad Request' });
      return;
    }
    // Atualizar o campo "status" do sensor para false
    const updatedSensor = await postSensorTable.update(sensorId, { status: false });
    if (updatedSensor.affected === 0) {
      res.status(404).send({ message: 'Sensor not found' });
    } else {
      res.send({ message: 'Sensor status updated successfully' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});


// Atualiza um sensor
sensorRoute.put('/:id', chechAuthenticated, async (req, res) => {
  try {
    const sensorId = req.params.id;
    const { sensorName, sensorIP, cityId } = req.body;

    // Verificar se o sensor existe
    const sensor = await postSensorTable.findOne({ where: { id: sensorId } });
    if (!sensor) {
      res.status(404).send({ message: 'Sensor not found' });
      return;
    }

    // Verificar se a cidade existe
    const city = await postCityTable.findOne({ where: { id: cityId } });
    if (!city) {
      res.status(404).send({ message: 'City not found' });
      return;
    }

    // Atualizar os campos do sensor com os novos valores
    sensor.name = sensorName;
    sensor.ip = sensorIP;
    sensor.cityId = cityId;

    console.log(sensor)

    // Salvar as alterações
    await postSensorTable.save(sensor);

    res.send({ message: 'Sensor updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});



module.exports = sensorRoute; 