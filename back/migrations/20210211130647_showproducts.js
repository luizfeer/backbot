exports.up = function(knex, Promise) {
    return knex.schema.table('product', table => {
        table.boolean('show').defaultTo(true)
        table.boolean('status').defaultTo(true)
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('product', table => {        
        table.dropColumn('show')
        table.dropColumn('status')
    })
};
