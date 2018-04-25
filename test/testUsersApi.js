import supertest from 'supertest';
import {server} from './../index.js';
import should from 'should'; // eslint-disable-line
// UNIT test begin
describe('User API unit test', function() {
this.timeout(120000); // eslint-disable-line
// #1 return a collection of json documents
it('should return collection of JSON documents', function(done) {
  // calling home page api
  supertest(server)
  .get('/api/user')
  .expect(200) // This is the HTTP response
  .end(function(err, res) {
      // HTTP status should be 200
      res.status.should.equal(200);
      done();
  });
});
});