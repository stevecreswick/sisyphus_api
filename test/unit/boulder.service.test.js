process.env.NODE_ENV = 'test';

const sinon = require('sinon');
const request = require('request');
const chai = require('chai');
const should = chai.should();

const boulders = require('./fixtures/boulders.json');

const base = 'http://localhost:1337';

describe('boulder service', () => {

  describe.skip('when not stubbed', () => {
    describe('GET /api/v1/boulders', () => {
      it('should return all boulders', (done) => {
        request.get(`${base}/api/v1/boulders`, (err, res, body) => {
          // there should be a 200 status code
          res.statusCode.should.eql(200);
          // the response should be JSON
          res.headers['content-type'].should.contain('application/json');
          // parse response body
          body = JSON.parse(body);
          // the JSON response body should have a
          // key-value pair of {"status": "success"}
          body.status.should.eql('success');
          // the JSON response body should have a
          // key-value pair of {"data": [3 boulder objects]}
          body.data.length.should.eql(3);
          // the first object in the data array should
          // have the right keys
          body.data[0].should.include.keys(
            'id', 'type_name', 'name',
            'message', 'parent_id', 'active',
            'completed_at', 'created_at', 'updated_at'
          );
          // the first object should have the right value for name
          body.data[0].name.should.eql('Create An App');
          done();
        });
      });
    });
    describe('GET /api/v1/boulders/:id', () => {
      it('should respond with a single boulder', (done) => {
        request.get(`${base}/api/v1/boulders/1`, (err, res, body) => {
          res.statusCode.should.equal(200);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('success');
          body.data[0].should.include.keys(
            'id', 'type_name', 'name',
            'message', 'parent_id', 'active',
            'completed_at', 'created_at', 'updated_at'
          );
          body.data[0].name.should.eql('Create An App');
          done();
        });
      });
      it('should throw an error if the boulder does not exist', (done) => {
        request.get(`${base}/api/v1/boulders/999`, (err, res, body) => {
          res.statusCode.should.equal(404);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('error');
          body.message.should.eql('That boulder does not exist.');
          done();
        });
      });
    });
    describe('POST /api/v1/boulders', () => {
      it('should return the boulder that was added', (done) => {
        const options = {
          method: 'post',
          body: {
            "id": 3,
            "type_name": "boulder",
            "name": "Kick rocks",
            "message": "Create an app to blah",
            "parent_id": null,
            "active": true,
            "completed_at": null,
            "created_at": "2018-02-17T02:54:48.052Z",
            "updated_at": "2018-02-17T02:54:48.052Z"
          },
          json: true,
          url: `${base}/api/v1/boulders`
        };
        request(options, (err, res, body) => {
          res.statusCode.should.equal(201);
          res.headers['content-type'].should.contain('application/json');
          body.status.should.eql('success');
          body.data[0].should.include.keys(
            'id', 'type_name', 'name',
            'message', 'parent_id', 'active',
            'completed_at', 'created_at', 'updated_at'
          );
          done();
        });
      });
    });
  });

  describe('when stubbed', () => {

    beforeEach(() => {
      this.get = sinon.stub(request, 'get');
      this.post = sinon.stub(request, 'post');
      this.put = sinon.stub(request, 'put');
      this.delete = sinon.stub(request, 'delete');
    });

    afterEach(() => {
      request.get.restore();
      request.post.restore();
      request.put.restore();
      request.delete.restore();
    });

    describe('GET /api/v1/boulders', () => {
      it('should return all boulders', (done) => {
        this.get.yields(
          null, boulders.all.success.res, JSON.stringify(boulders.all.success.body)
        );
        request.get(`${base}/api/v1/boulders`, (err, res, body) => {
          // there should be a 200 status code
          res.statusCode.should.eql(200);
          // the response should be JSON
          res.headers['content-type'].should.contain('application/json');
          // parse response body
          body = JSON.parse(body);
          // the JSON response body should have a
          // key-value pair of {"status": "success"}
          body.status.should.eql('success');
          // the JSON response body should have a
          // key-value pair of {"data": [3 boulder objects]}
          body.data.length.should.eql(3);
          // the first object in the data array should
          // have the right keys
          body.data[0].should.include.keys(
            'id', 'type_name', 'name',
            'message', 'parent_id', 'active',
            'completed_at', 'created_at', 'updated_at'
          );
          // the first object should have the right value for name
          body.data[0].name.should.eql('Create An App');
          done();
        });
      });
    });
    describe('GET /api/v1/boulders/:id', () => {
      it('should respond with a single boulder', (done) => {
        const obj = boulders.single.success;
        this.get.yields(null, obj.res, JSON.stringify(obj.body));
        request.get(`${base}/api/v1/boulders/3`, (err, res, body) => {
          res.statusCode.should.equal(200);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('success');
          body.data[0].should.include.keys(
            'id', 'type_name', 'name',
            'message', 'parent_id', 'active',
            'completed_at', 'created_at', 'updated_at'
          );
          body.data[0].name.should.eql('Kick rocks');
          done();
        });
      });
      it('should throw an error if the boulder does not exist', (done) => {
        const obj = boulders.single.failure;
        this.get.yields(null, obj.res, JSON.stringify(obj.body));
        request.get(`${base}/api/v1/boulders/999`, (err, res, body) => {
          res.statusCode.should.equal(404);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('error');
          body.message.should.eql('That boulder does not exist.');
          done();
        });
      });
    });
    describe('POST /api/v1/boulders', () => {
      it('should return the boulder that was added', (done) => {
        const options = {
          body: {
            "id": 3,
            "type_name": "boulder",
            "name": "Kick rocks",
            "message": "Create an app to blah",
            "parent_id": null,
            "active": true,
            "completed_at": null,
            "created_at": "2018-02-17T02:54:48.052Z",
            "updated_at": "2018-02-17T02:54:48.052Z"
          },
          json: true,
          url: `${base}/api/v1/boulders`
        };
        const obj = boulders.add.success;
        this.post.yields(null, obj.res, JSON.stringify(obj.body));
        request.post(options, (err, res, body) => {
          res.statusCode.should.equal(201);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('success');
          body.data[0].should.include.keys(
            'id', 'type_name', 'name',
            'message', 'parent_id', 'active',
            'completed_at', 'created_at', 'updated_at'
          );
          body.data[0].name.should.eql('Kick rocks');
          done();
        });
      });
      it('should throw an error if the payload is malformed', (done) => {
        const options = {
          body: { name: 'Kick rocks' },
          json: true,
          url: `${base}/api/v1/boulders`
        };
        const obj = boulders.add.failure;
        this.post.yields(null, obj.res, JSON.stringify(obj.body));
        request.post(options, (err, res, body) => {
          res.statusCode.should.equal(400);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('error');
          should.exist(body.message);
          done();
        });
      });
    });
    describe('PUT /api/v1/boulders', () => {
      it('should return the boulder that was updated', (done) => {
        const options = {
          body: { active: false },
          json: true,
          url: `${base}/api/v1/boulders/3`
        };
        const obj = boulders.update.success;
        this.put.yields(null, obj.res, JSON.stringify(obj.body));
        request.put(options, (err, res, body) => {
          res.statusCode.should.equal(200);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('success');
          body.data[0].should.include.keys(
            'id', 'type_name', 'name',
            'message', 'parent_id', 'active',
            'completed_at', 'created_at', 'updated_at'
          );
          body.data[0].name.should.eql('Kick rocks');
          body.data[0].active.should.eql(false);
          done();
        });
      });
      it('should throw an error if the boulder does not exist', (done) => {
        const options = {
          body: { active: false },
          json: true,
          url: `${base}/api/v1/boulders/5`
        };
        const obj = boulders.update.failure;
        this.put.yields(null, obj.res, JSON.stringify(obj.body));
        request.put(options, (err, res, body) => {
          res.statusCode.should.equal(404);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('error');
          body.message.should.eql('That boulder does not exist.');
          done();
        });
      });
    });
    describe('DELETE /api/v1/boulders/:id', () => {
      it('should return the boulder that was deleted', (done) => {
        const obj = boulders.delete.success;
        this.delete.yields(null, obj.res, JSON.stringify(obj.body));
        request.delete(`${base}/api/v1/boulders/5`, (err, res, body) => {
          res.statusCode.should.equal(200);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('success');
          body.data[0].should.include.keys(
            'id', 'type_name', 'name',
            'message', 'parent_id', 'active',
            'completed_at', 'created_at', 'updated_at'
          );
          body.data[0].name.should.eql('Kick rocks');
          done();
        });
      });
      it('should throw an error if the boulder does not exist', (done) => {
        const obj = boulders.delete.failure;
        this.delete.yields(null, obj.res, JSON.stringify(obj.body));
        request.delete(`${base}/api/v1/boulders/5`, (err, res, body) => {
          res.statusCode.should.equal(404);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('error');
          body.message.should.eql('That boulder does not exist.');
          done();
        });
      });
    });
  });
});
