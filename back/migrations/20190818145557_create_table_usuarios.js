exports.up = function(knex, Promise) {
    return knex.schema.createTable('address', table => {
        table.increments('id_address').primary()

        table.string('city').notNull()
        table.string('street').notNull()
        table.string('number').notNull()
        table.string('cep').notNull()

        table.integer('id_user_address').notNull()
        .references('id_user')
        .inTable('user')
        .notNull()
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
        /*   .references('id')
               .inTable('categories')
           table.boolean('admin').notNull().defaultTo(false)*/
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('address')
};