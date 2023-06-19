const { EntitySchema } = require('typeorm');

const WeatherSchema = new EntitySchema({
    name: 'WeatherSchema',
    tableName: 'Weather',
    columns: {
        id: { primary: true, type: 'uuid', generated: 'uuid' },
        tempc: { type: 'numeric', nullable: true },
        tempf: { type: 'numeric', nullable: true },
        humidity: { type: 'numeric', nullable: true },
        date: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP'
        },
        sensorId: { type: 'uuid'}
    },
    relations: {
        weather_sensor: {
            type: 'many-to-one', // Tipo da relação (muitos para um)
            target: 'SensorSchema', // Nome da entidade relacionada
            joinColumn: { name: 'sensorId' } // Coluna da chave estrangeira na entidade atual
        }
    }
});

module.exports = WeatherSchema;