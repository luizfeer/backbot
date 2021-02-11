exports.up = function(knex, Promise) {
    return knex.schema.table('additional', table => {
        table.integer('code')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('additional', table => {        
        table.dropColumn('code')

    })
};
