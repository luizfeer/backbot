// Update with your config settings.

module.exports = {
    client: 'postgresql',
    connection: {
        host : 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'dbwoner',
        password: '2conrinTIOS4'

    },
    pool: {
        min: 2,
        max: 60
    },
    migrations: {
        tableName: 'knex_migrations'
    }
}