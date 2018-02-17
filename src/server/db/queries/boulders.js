const knex = require('../connection');

function getAllBoulders() {
  return knex('boulders')
  .select('*');
}

function getSingleBoulder(id) {
  return knex('boulders')
  .select('*')
  .where({ id: parseInt(id) });
}

function getBoulderBoulders(id) {
  return knex('boulders')
  .select('*')
  .where({ parent_id: parseInt(id) });
}

function addBoulder(boulder) {
  return knex('boulders')
  .insert(boulder)
  .returning('*');
}

function updateBoulder(id, boulder) {
  return knex('boulders')
  .update(boulder)
  .where({ id: parseInt(id) })
  .returning('*');
}

function deleteBoulder(id) {
  return knex('boulders')
  .del()
  .where({ id: parseInt(id) })
  .returning('*');
}

module.exports = {
  getAllBoulders,
  getSingleBoulder,
  getBoulderBoulders,
  addBoulder,
  updateBoulder,
  deleteBoulder
};
