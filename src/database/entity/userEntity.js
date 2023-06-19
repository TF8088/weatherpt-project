const { EntitySchema } = require('typeorm');

const UserSchema = new EntitySchema({
    name: 'UserSchema',
    tableName: 'User',
    columns: {
        id: { primary: true, type: 'uuid', generated: 'uuid' },
        name: { type: 'varchar' },
        email: { type: 'varchar' },
        password: { type: 'varchar' },
        isadmin: { type: 'boolean' },
    },
});

module.exports = UserSchema;