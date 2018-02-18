process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../src/server/index');
const knex = require('../../src/server/db/connection');

describe('routes : rocks', () => {
  beforeEach(() => {
    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  // --------------------------------------------------------------------
  // GET Boulders
  // --------------------------------------------------------------------
  describe('GET /api/v1/rocks', () => {
    it('should return all rocks', (done) => {
      chai.request(server)
      .get('/api/v1/rocks')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": [3 rock objects]}
        res.body.data.length.should.eql(3);
        // the first object in the data array should
        // have the right keys
        res.body.data[0].should.include.keys(
          'id', 'type_name', 'name',
          'message', 'parent_id', 'active',
          'completed_at', 'created_at', 'updated_at'
        );
        done();
      });
    });
  });

  // --------------------------------------------------------------------
  // GET Boulder
  // --------------------------------------------------------------------
  describe('GET /api/v1/rocks/:id', () => {
    it('should respond with a single rock', (done) => {
      chai.request(server)
      .get('/api/v1/rocks/1')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": 1 rock object}
        res.body.data[0].should.include.keys(
          'id', 'type_name', 'name',
          'message', 'parent_id', 'active',
          'completed_at', 'created_at', 'updated_at'
        );
        done();
      });
    });

    it('should throw an error if the rock does not exist', (done) => {
      chai.request(server)
      .get('/api/v1/rocks/9999999')
      .end((err, res) => {
        // there should an error
        should.exist(err);
        // there should be a 404 status code
        res.status.should.equal(404);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // the JSON response body should have a
        // key-value pair of {"message": "That rock does not exist."}
        res.body.message.should.eql('That rock does not exist.');
        done();
      });
    });
  });

  // --------------------------------------------------------------------
  // POST Boulders
  // --------------------------------------------------------------------
  describe('POST /api/v1/rocks', () => {
    it('should return the rock that was added', (done) => {
      chai.request(server)
      .post('/api/v1/rocks')
      .send({
        name: 'Do more stuff',
        message: 'yeeeeahhhhhh'
      })
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 201 status code
        // (indicating that something was "created")
        res.status.should.equal(201);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": 1 rock object}
        res.body.data[0].should.include.keys(
          'id', 'type_name', 'name',
          'message', 'parent_id', 'active',
          'completed_at', 'created_at', 'updated_at'
        );
        done();
      });
    });

    it('should throw an error if the payload is malformed', (done) => {
      chai.request(server)
      .post('/api/v1/rocks')
      .send({
        message: 'Titanic'
      })
      .end((err, res) => {
        // there should an error
        should.exist(err);
        // there should be a 400 status code
        res.status.should.equal(400);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // the JSON response body should have a message key
        should.exist(res.body.message);
        done();
      });
    });
  });

// --------------------------------------------------------------------
// PUT Boulders
// --------------------------------------------------------------------

  describe('PUT /api/v1/rocks', () => {
    it('should return the rock that was updated', (done) => {
      knex('rocks')
      .select('*')
      .then((rock) => {
        const rockObject = rock[0];
        chai.request(server)
        .put(`/api/v1/rocks/${rockObject.id}`)
        .send({
          active: false
        })
        .end((err, res) => {
          // there should be no errors
          should.not.exist(err);
          // there should be a 200 status code
          res.status.should.equal(200);
          // the response should be JSON
          res.type.should.equal('application/json');
          // the JSON response body should have a
          // key-value pair of {"status": "success"}
          res.body.status.should.eql('success');
          // the JSON response body should have a
          // key-value pair of {"data": 1 rock object}
          res.body.data[0].should.include.keys(
            'id', 'type_name', 'name',
            'message', 'parent_id', 'active',
            'completed_at', 'created_at', 'updated_at'
          );
          // ensure the rock was in fact updated
          const newBoulderObject = res.body.data[0];
          newBoulderObject.active.should.not.eql(rockObject.active);
          done();
        });
      });
    });

    it('should throw an error if the rock does not exist', (done) => {
      chai.request(server)
      .put('/api/v1/rocks/9999999')
      .send({
        active: false
      })
      .end((err, res) => {
        // there should an error
        should.exist(err);
        // there should be a 404 status code
        res.status.should.equal(404);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // the JSON response body should have a
        // key-value pair of {"message": "That rock does not exist."}
        res.body.message.should.eql('That rock does not exist.');
        done();
      });
    });
  });

  // --------------------------------------------------------------------
  // DELETE Boulders
  // --------------------------------------------------------------------
  describe('DELETE /api/v1/rocks/:id', () => {
    it('should return the rock that was deleted', (done) => {
      knex('rocks')
      .select('*')
      .then((rocks) => {
        const rockObject = rocks[0];
        const lengthBeforeDelete = rocks.length;
        chai.request(server)
        .delete(`/api/v1/rocks/${rockObject.id}`)
        .end((err, res) => {
          // there should be no errors
          should.not.exist(err);
          // there should be a 200 status code
          res.status.should.equal(200);
          // the response should be JSON
          res.type.should.equal('application/json');
          // the JSON response body should have a
          // key-value pair of {"status": "success"}
          res.body.status.should.eql('success');
          // the JSON response body should have a
          // key-value pair of {"data": 1 rock object}
          res.body.data[0].should.include.keys(
            'id', 'type_name', 'name',
            'message', 'parent_id', 'active',
            'completed_at', 'created_at', 'updated_at'
          );
          // ensure the rock was in fact deleted
          knex('rocks').select('*')
          .then((updatedBoulders) => {
            updatedBoulders.length.should.eql(lengthBeforeDelete - 1);
            done();
          });
        });
      });
    });

    it('should throw an error if the rock does not exist', (done) => {
      chai.request(server)
      .delete('/api/v1/rocks/9999999')
      .end((err, res) => {
        // there should an error
        should.exist(err);
        // there should be a 404 status code
        res.status.should.equal(404);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // the JSON response body should have a
        // key-value pair of {"message": "That rock does not exist."}
        res.body.message.should.eql('That rock does not exist.');
        done();
      });
    });
  });


  // --------------------------------------------------------------------
  // ASSOCIATIONS
  // --------------------------------------------------------------------

  // --------------------------------------------------------------------
  // GET Boulder Boulders
  // --------------------------------------------------------------------
  describe('GET /api/v1/rocks/:id/rocks', () => {
    it('should return the rocks of the given rock', (done) => {
      chai.request(server)
      .get('/api/v1/rocks/1/rocks')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": [3 rock objects]}
        res.body.data.length.should.eql(1);
        // the first object in the data array should
        // have the right keys
        res.body.data[0].should.include.keys(
          'id', 'type_name', 'name',
          'message', 'parent_id', 'active',
          'completed_at', 'created_at', 'updated_at'
        );
        done();
      });
    });

    it('should throw an error if the rock does not exist', (done) => {
      chai.request(server)
      .get('/api/v1/rocks/999999/rocks')
      .end((err, res) => {
        // there should an error
        should.exist(err);
        // there should be a 404 status code
        res.status.should.equal(404);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // the JSON response body should have a
        // key-value pair of {"message": "That rock does not exist."}
        res.body.message.should.eql('That rock does not exist.');
        done();
      });
    });
  });
});
