const { EntitySchema } = require('typeorm');

const SensorSchema = new EntitySchema({
    name: 'SensorSchema',
    tableName: 'Sensor',
    columns: {
        id: { primary: true, type: 'uuid', generated: 'uuid' },
        ip: { type: 'varchar' },
        name: { type: 'varchar' },
        cityId: { type: 'uuid' },
        status: { type: 'boolean', default: true },
    },
    relations: {
        sensor_city: {
            type: 'many-to-one', // Tipo da relação (muitos para um)
            target: 'CitySchema', // Nome da entidade relacionada
            joinColumn: { name: 'cityId' } // Coluna da chave estrangeira na entidade atual
        }
    }
});

module.exports = SensorSchema;