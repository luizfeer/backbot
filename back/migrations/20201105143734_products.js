exports.up = function(knex, Promise) {
    return knex.schema.createTable('product', table => {
        table.increments('id_product').primary()
        table.string('code')
        
        table.string('name').notNull()
        table.string('keywords').notNull()
        table.string('description_menu').notNull()
        table.string('description')
        table.float('price').notNull()
               

        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
        /*   .references('id')
               .inTable('categories')
           table.boolean('admin').notNull().defaultTo(false)*/
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('product')
};