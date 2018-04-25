import supertest from 'supertest';
import {server} from './../index.js';
import should from 'should'; // eslint-disable-line
// UNIT test begin
describe('Users API unit test', function() {
  this.timeout(120000); // eslint-disable-line
  // #1 return a collection of json documents
  it('should return collection of JSON documents', function(done) {
    // calling home page api
    supertest(server)
    .get('/api/user')
    .expect('Content-type', /json/)
    .expect(200) // This is the HTTP response
    .end(function(err, res) {
        // HTTP status should be 200
        res.status.should.equal(200);
        done();
    });
  });

  // #2 add a user
  it('should register a user', function(done) {
    // post to /api/contacts
    supertest(server)
    .post('/api/user')
    .query({action: 'register'})
    .send(
        {
  fName: "Eddie",
  lName: "Englebert",
  streetAddress1: "1 Eddie street",
  streetAddress2: "Eddie Estate",
  townCity: "Eddie Town",
  countyState: "County Eddie",
  email: "eddie@email.com",
  userName: "eddie101",
  password: "eddiePword",
  admin: false
}
        )
    .expect('Content-type', /json/)
    .expect(201)
    .end(function(err, res) {
      res.status.should.equal(201);
      should.exist(res.body._id);
      done();
    });
  });

  // #3 login a user
  it('should authenticate a user', function(done) {
    // post to /api/contacts
    supertest(server)
    .post('/api/user')
    .send({'userName': 'adam101', password: 'adamPword'})
    .expect('Content-type', /json/)
    .expect(200)
    .end(function(err, res) {
      res.status.should.equal(200);
      //res.body.token.substring(0, 3).should.equal('JWT');
      done();
    });
  });
});