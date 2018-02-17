process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../src/server/index');
const knex = require('../../src/server/db/connection');

describe('routes : boulders', () => {
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
  describe('GET /api/v1/boulders', () => {
    it('should return all boulders', (done) => {
      chai.request(server)
      .get('/api/v1/boulders')
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
        // key-value pair of {"data": [3 boulder objects]}
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
  describe('GET /api/v1/boulders/:id', () => {
    it('should respond with a single boulder', (done) => {
      chai.request(server)
      .get('/api/v1/boulders/1')
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
        // key-value pair of {"data": 1 boulder object}
        res.body.data[0].should.include.keys(
          'id', 'type_name', 'name',
          'message', 'parent_id', 'active',
          'completed_at', 'created_at', 'updated_at'
        );
        done();
      });
    });

    it('should throw an error if the boulder does not exist', (done) => {
      chai.request(server)
      .get('/api/v1/boulders/9999999')
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
        // key-value pair of {"message": "That boulder does not exist."}
        res.body.message.should.eql('That boulder does not exist.');
        done();
      });
    });
  });

  // --------------------------------------------------------------------
  // POST Boulders
  // --------------------------------------------------------------------
  describe('POST /api/v1/boulders', () => {
    it('should return the boulder that was added', (done) => {
      chai.request(server)
      .post('/api/v1/boulders')
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
        // key-value pair of {"data": 1 boulder object}
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
      .post('/api/v1/boulders')
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

  describe('PUT /api/v1/boulders', () => {
    it('should return the boulder that was updated', (done) => {
      knex('boulders')
      .select('*')
      .then((boulder) => {
        const boulderObject = boulder[0];
        chai.request(server)
        .put(`/api/v1/boulders/${boulderObject.id}`)
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
          // key-value pair of {"data": 1 boulder object}
          res.body.data[0].should.include.keys(
            'id', 'type_name', 'name',
            'message', 'parent_id', 'active',
            'completed_at', 'created_at', 'updated_at'
          );
          // ensure the boulder was in fact updated
          const newBoulderObject = res.body.data[0];
          newBoulderObject.active.should.not.eql(boulderObject.active);
          done();
        });
      });
    });

    it('should throw an error if the boulder does not exist', (done) => {
      chai.request(server)
      .put('/api/v1/boulders/9999999')
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
        // key-value pair of {"message": "That boulder does not exist."}
        res.body.message.should.eql('That boulder does not exist.');
        done();
      });
    });
  });

  // --------------------------------------------------------------------
  // DELETE Boulders
  // --------------------------------------------------------------------
  describe('DELETE /api/v1/boulders/:id', () => {
    it('should return the boulder that was deleted', (done) => {
      knex('boulders')
      .select('*')
      .then((boulders) => {
        const boulderObject = boulders[0];
        const lengthBeforeDelete = boulders.length;
        chai.request(server)
        .delete(`/api/v1/boulders/${boulderObject.id}`)
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
          // key-value pair of {"data": 1 boulder object}
          res.body.data[0].should.include.keys(
            'id', 'type_name', 'name',
            'message', 'parent_id', 'active',
            'completed_at', 'created_at', 'updated_at'
          );
          // ensure the boulder was in fact deleted
          knex('boulders').select('*')
          .then((updatedBoulders) => {
            updatedBoulders.length.should.eql(lengthBeforeDelete - 1);
            done();
          });
        });
      });
    });

    it('should throw an error if the boulder does not exist', (done) => {
      chai.request(server)
      .delete('/api/v1/boulders/9999999')
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
        // key-value pair of {"message": "That boulder does not exist."}
        res.body.message.should.eql('That boulder does not exist.');
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
  describe('GET /api/v1/boulders/:id/boulders', () => {
    it('should return the boulders of the given boulder', (done) => {
      chai.request(server)
      .get('/api/v1/boulders/1/boulders')
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
        // key-value pair of {"data": [3 boulder objects]}
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

    it('should throw an error if the boulder does not exist', (done) => {
      chai.request(server)
      .get('/api/v1/boulders/999999/boulders')
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
        // key-value pair of {"message": "That boulder does not exist."}
        res.body.message.should.eql('That boulder does not exist.');
        done();
      });
    });
  });
});
