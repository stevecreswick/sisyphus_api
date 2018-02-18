exports.seed = (knex, Promise) => {
  return knex('rocks').del()
  .then(() => {
    return knex('rocks').insert({
      name: 'Create An App',
      message: 'Create an app to blah'
    });
  })
  .then(() => {
    return knex('rocks').insert({
      name: 'Create An App 2',
      message: 'Create an app to yeeeahhh'
    });
  })
  .then(() => {
    return knex('rocks').insert({
      name: 'Kick rocks',
      message: 'Create an app to blah'
    });
  });
};
