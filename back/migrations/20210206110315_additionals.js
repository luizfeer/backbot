exports.up = function(knex, Promise) {
    return knex.schema.createTable('additional', table => {
        table.increments('id_additional').primary()

        table.integer('id_additional_type') 
             
        table.string('name').notNull()
        table.string('keywords').notNull()
        table.string('description_menu').notNull()
        table.string('description')
        table.float('price').notNull()

        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())   
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('additional')
};