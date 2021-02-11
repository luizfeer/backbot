exports.up = function(knex, Promise) {
    return knex.schema.createTable('service', table => {
        table.increments('id_service').primary()

        table.integer('id_user_service').notNull()
        .references('id_user')
        .inTable('user')
        .notNull()
        .onUpdate('CASCADE')
        .onDelete('CASCADE')        
 
        table.integer('stage_service').notNull().defaultTo(0)
        table.boolean('closed').notNull().defaultTo(false)
        table.boolean('recived').notNull().defaultTo(false)
        table.boolean('finished').notNull().defaultTo(false)
        table.boolean('sending').notNull().defaultTo(false)


        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
        /*   .references('id')
               .inTable('categories')
           table.boolean('admin').notNull().defaultTo(false)*/
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('service')
};