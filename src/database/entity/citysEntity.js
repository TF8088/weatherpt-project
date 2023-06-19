const { EntitySchema } = require('typeorm');

const CitySchema = new EntitySchema({
    name: 'CitySchema',
    tableName: 'City ',
    columns: {
        id: { primary: true, type: 'uuid', generated: 'uuid' },
        name: { type: 'varchar' },
        lat: { type: 'numeric' },
        long: { type: 'numeric' }
    },
});

module.exports = CitySchema;