exports.up = function(knex, Promise) {
    return knex.schema.table('address', table => {
        table.boolean('status')
        .defaultTo(false)
        table.string('address')

    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('address', table => {
        table.dropColumn('status')
        table.dropColumn('address')
    })
};