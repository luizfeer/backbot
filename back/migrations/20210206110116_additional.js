exports.up = function(knex, Promise) {
    return knex.schema.table('product', table => {
        table.boolean('additional').defaultTo(false)
        table.integer('additional_type')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('product', table => {        
        table.dropColumn('additional')
        table.dropColumn('additional_type')
    })
};
