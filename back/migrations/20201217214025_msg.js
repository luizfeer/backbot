exports.up = function(knex, Promise) {
    return knex.schema.createTable('msg', table => {
        table.increments('id_msg').primary()
            // table.integer('idAreaAtuacao')
        table.string('msg').notNull()
        table.string('phone').notNull()
        table.boolean('send').notNull().defaultTo(false)
        table.timestamp('created_at').defaultTo(knex.fn.now())
            //   table.boolean('admin').notNull().defaultTo(false)*/
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('msg')
};