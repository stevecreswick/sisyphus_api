const knex = require('../connection');

function getAllRocks() {
  return knex('rocks')
  .select('*');
}

function getSingleRock(id) {
  return knex('rocks')
  .select('*')
  .where({ id: parseInt(id) });
}

function getRockRocks(id) {
  return knex('rocks')
  .select('*')
  .where({ parent_id: parseInt(id) });
}

function addRock(rock) {
  return knex('rocks')
  .insert(rock)
  .returning('*');
}

function updateRock(id, rock) {
  return knex('rocks')
  .update(rock)
  .where({ id: parseInt(id) })
  .returning('*');
}

function deleteRock(id) {
  return knex('rocks')
  .del()
  .where({ id: parseInt(id) })
  .returning('*');
}

module.exports = {
  getAllRocks,
  getSingleRock,
  getRockRocks,
  addRock,
  updateRock,
  deleteRock
};
