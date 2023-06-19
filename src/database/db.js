const { DataSource } = require('typeorm');
const WeatherSchema = require('./entity/weatherEntity');
const UserSchema = require('./entity/userEntity');
const SensorSchema = require('./entity/sensorEntity');
const CitySchema =  require('./entity/citysEntity');

const dataSource = new DataSource({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  password: 'weatherpt',
  database: '',
  synchronize: true,
  entities: [ WeatherSchema, UserSchema, SensorSchema, CitySchema ],
});

dataSource.initialize().then(() => console.log('Connected to DB succesfully!'));

module.exports = dataSource;
