exports.up = function(knex, Promise) {
    return knex.schema.createTable('user', table => {
        table.increments('id_user').primary()
            // table.integer('idAreaAtuacao')
        table.string('name')
        table.string('cpf')
        table.date('birthdate')
        table.string('phone').notNull()
        table.string('email')
        table.boolean('status').notNull().defaultTo(true)
        table.integer('stage').notNull().defaultTo(0)
        table.jsonb('aux')        
        table.timestamp('date_stage').defaultTo(knex.fn.now())
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())


            //   table.boolean('admin').notNull().defaultTo(false)*/
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('user')
};