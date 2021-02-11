exports.up = function(knex, Promise) {
    return knex.schema.createTable('host', table => {
        table.increments('id_host').primary()

        table.string('name').notNull()
        table.string('token').notNull()
        table.string('password').notNull()
        table.string('email').notNull()
        table.string('phone').notNull()

        table.boolean('active').notNull().defaultTo(true)
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('host')
};