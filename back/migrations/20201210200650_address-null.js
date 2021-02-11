exports.up = function(knex, Promise) {
    return knex.schema.alterTable('address', table => {
        table.string('city').nullable().alter();
        table.string('street').nullable().alter();
        table.string('number').nullable().alter();
        table.string('cep').nullable().alter();

    })
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('address', table => {
        table.string('city').notNullable().alter();
        table.string('street').notNullable().alter();
        table.string('number').notNullable().alter();
        table.string('cep').notNullable().alter();
    })
};