exports.up = function(knex, Promise) {
    return knex.schema.createTable('service_products', table => {
        table.increments('id_sp').primary()

        table.integer('id_service').notNull()
        .references('id_service')
        .inTable('service')
        .notNull()
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        
        table.integer('id_product').notNull()
        .references('id_product')
        .inTable('product')
        .notNull()
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

        table.integer('amount')
        .notNull()
        .defaultTo(1)

        table.boolean('status')
        .notNull()
        .defaultTo(false)
        
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
        /*   .references('id')
               .inTable('categories')
           table.boolean('admin').notNull().defaultTo(false)*/
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('service_products')
};