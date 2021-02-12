// Update with your config settings.
require('dotenv').config({  
    path: process.env.NODE_ENV === "test" ? ".env.testing" : ".env"
  })
module.exports = {
    client: 'postgresql',
    connection: {
        host : process.env.DB_HOST,
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