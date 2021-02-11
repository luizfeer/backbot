exports.up = function(knex, Promise) {
    return knex.schema.createTable('service_additional', table => {
        table.increments('id_sa').primary()

        table.integer('id_service').notNull()
        .references('id_service')
        .inTable('service')
        .notNull()
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        
        table.integer('id_sp').notNull()
        .references('id_sp')
        .inTable('service_products')
        .notNull()
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

        table.integer('id_additional').notNull()
        .references('id_additional')
        .inTable('additional')
        .notNull()
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

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