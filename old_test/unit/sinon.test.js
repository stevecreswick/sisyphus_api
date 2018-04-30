process.env.NODE_ENV = 'test';

const sinon = require('sinon');
const chai = require('chai');
const should = chai.should();

function greaterThanTwenty(num) {
  if (num > 20) return true;
  return false;
}

describe('Sample Sinon Stub', () => {
  it('should pass', (done) => {
    const greaterThanTwenty = sinon.stub().returns('something');
    greaterThanTwenty(0).should.eql('something');
    greaterThanTwenty(0).should.not.eql(false);
    done();
  });
});
