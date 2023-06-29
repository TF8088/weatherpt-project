const express = require('express');
const cityRoute = express.Router();

const dataSource = require('../../../database/db')

const CitySchema = require('../../../database/entity/citysEntity');
const postCityTable = dataSource.getRepository(CitySchema);


// Pesquisa de Todos os sensores mais cidade 
cityRoute.get('/', async (req, res) => {
    try {
      const cities = await postCityTable.find();
      res.send(cities);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  });
module.exports = cityRoute;