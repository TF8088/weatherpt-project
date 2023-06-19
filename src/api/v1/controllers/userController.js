const express = require('express');
const sensorRoute = express.Router();

const { ILike } = require('typeorm');
const dataSource = require('../../../database/db')

const UserSchema = require('../../../database/entity/userEntity');
const postSensorTable = dataSource.getRepository(SensorSchema);