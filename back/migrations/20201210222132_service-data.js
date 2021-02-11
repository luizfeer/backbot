exports.up = function(knex, Promise) {
    return knex.schema.table('service', table => {
        table.boolean('payment_card').defaultTo(false)
        table.boolean('payment_pix').defaultTo(false)
        table.boolean('producing').defaultTo(false)        
        table.timestamp('closed_at')
        table.float('change')      
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('service', table => {        
        table.dropColumn('payment_card')
        table.dropColumn('payment_pix')
        table.dropColumn('change')
        table.dropColumn('producing')        
        table.dropColumn('closed_at')
    })
};