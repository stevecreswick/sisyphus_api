exports.seed = (knex, Promise) => {
  return knex('boulders').del()
  .then(() => {
    return knex('boulders').insert({
      name: 'Create An App',
      message: 'Create an app to blah'
    });
  })
  .then(() => {
    return knex('boulders').insert({
      name: 'Create An App 2',
      message: 'Create an app to yeeeahhh'
    });
  })
  .then(() => {
    return knex('boulders').insert({
      name: 'Kick rocks',
      message: 'Create an app to blah'
    });
  });
};
