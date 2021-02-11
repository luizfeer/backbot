exports.up = function(knex, Promise) {
    return knex.schema.table('service', table => {
        table.integer('id_address_service')
        .references('id_address')
        .inTable('address')
        .onUpdate('CASCADE')
        .onDelete('CASCADE') 
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('service', table => {
        table.dropColumn('id_address_service')
    })
};