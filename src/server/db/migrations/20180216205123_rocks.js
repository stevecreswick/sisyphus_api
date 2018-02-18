
exports.up = function(knex, Promise) {
  return knex.schema.createTable('rocks', (table) => {
    table.increments('id').primary();
    table.string('type_name').defaultTo('boulder');
    table.string('name').notNullable();
    table.string('message').defaultTo('');
    table.integer('parent_id').references('rocks.id');
    table.boolean('active').defaultTo(true);
    table.dateTime('completed_at');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('rocks');
};
