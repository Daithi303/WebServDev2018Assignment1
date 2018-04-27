import supertest from 'supertest';
import bodyParser from 'body-parser';
import {server} from './../index.js';
import should from 'should'; // eslint-disable-line
server.use(bodyParser.json());
// UNIT test begin
describe('Users API unit test', function() {
  this.timeout(120000); // eslint-disable-line
  // #1 return a collection of json documents
      
  
    it('should NOT get all users without a token', function(done) {
    supertest(server)
    .get('/api/device')
    .expect('Content-type', /json/)
    .expect(401)
    .end(function(err, res) {
      res.status.should.equal(401);
      done();
    });
  });
    

      it('should NOT get a specific device (device0001) without a token', function(done) {
    supertest(server)
    .get('/api/device/device0001')
    .expect('Content-type', /json/)
    .expect(401)
    .end(function(err, res) {
      res.status.should.equal(401);
      done();
    });
  });
  
  
      it('should get a specific user (device0001) with admin (claire101) token', function(done) {
    supertest(server)
    .get('/api/device/device0001')
    .set('Authorization', 'BEARER eyJhbGciOiJIUzI1NiJ9.Y2xhaXJlMTAx.hlwNkvb-NsWNNCTrznxQEQmHlxdLO-UqOUOKiRPdeJQ')
    .expect('Content-type', /json/)
    .expect(200)
    .end(function(err, res) {
      res.status.should.equal(200);
      done();
    });
  });
});