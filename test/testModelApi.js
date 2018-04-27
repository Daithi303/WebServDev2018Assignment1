import supertest from 'supertest';
import bodyParser from 'body-parser';
import {server} from './../index.js';
import should from 'should'; // eslint-disable-line
server.use(bodyParser.json());
// UNIT test begin

describe('Users API unit test', function() {
  this.timeout(120000); // eslint-disable-line
  
     it('should NOT register a user', function(done) {
    // post to /api/contacts
    supertest(server)
    .post('/api/user')
    .query({action: 'register'})
    .send({}).expect('Content-type', /json/)
    .expect(401)
    .end(function(err, res) {
      res.status.should.equal(401);
      res.body.success.should.equal(false);
      done();
    });
  });
 
   it('should register a user', function(done) {
    // post to /api/contacts
    supertest(server)
    .post('/api/user')
    .query({action: 'register'})
    .send(        {
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
}).expect('Content-type', /json/)
    .expect(201)
    .end(function(err, res) {
      res.status.should.equal(201);
      should.exist(res.body._id);
      done();
    });
  });
  
    it('should NOT authenticate a user (a non-existing user)', function(done) {
    supertest(server)
    .post('/api/user')
    .send({userName: 'notInDatabase', password: 'notInDatabase'})
    .expect('Content-type', /json/)
    .expect(401)
    .end(function(err, res) {
      res.status.should.equal(401);
     res.body.success.should.equal(false);
      done();
    });
  });
  
    it('should authenticate a user (barry101)', function(done) {
    supertest(server)
    .post('/api/user')
    .send({userName: 'barry101', password: 'barryPword'})
    .expect('Content-type', /json/)
    .expect(200)
    .end(function(err, res) {
      res.status.should.equal(200);
     res.body.token.substring(0, 3).should.equal('JWT');
      done();
    });
  });
  
    it('should NOT get all users without valid token', function(done) {
    supertest(server)
    .get('/api/user')
    .expect('Content-type', /json/)
    .expect(401)
    .end(function(err, res) {
      res.status.should.equal(401);
      done();
    });
  });
  
    it('should get all users with valid token', function(done) {
    supertest(server)
    .get('/api/user')
    .set('Authorization', 'BEARER eyJhbGciOiJIUzI1NiJ9.YWRhbTEwMQ.8ll7ugQIlrdkorqAG06rKp85SX5RX2-yDSBPl3HR8XI')
    .expect('Content-type', /json/)
    .expect(200)
    .end(function(err, res) {
      res.status.should.equal(200);
      done();
    });
  });
  
  
      it('should NOT get a specific user (barry101) with admin (adam101) token', function(done) {
    supertest(server)
    .get('/api/user/barry101')
    .expect('Content-type', /json/)
    .expect(401)
    .end(function(err, res) {
      res.status.should.equal(401);
      done();
    });
  });
  
  
      it('should get a specific user (barry101) with admin (adam101) token', function(done) {
    supertest(server)
    .get('/api/user/barry101')
    .set('Authorization', 'BEARER eyJhbGciOiJIUzI1NiJ9.YWRhbTEwMQ.8ll7ugQIlrdkorqAG06rKp85SX5RX2-yDSBPl3HR8XI')
    .expect('Content-type', /json/)
    .expect(200)
    .end(function(err, res) {
      res.status.should.equal(200);
      done();
    });
  });
  
      it('should NOT modify a specific user (barry101) without a token', function(done) {
    supertest(server)
    .put('/api/user/barry101')
    .send({'email': 'barryModified@bmail.com'})
    .expect('Content-type', /json/)
    .expect(401)
    .end(function(err, res) {
      res.status.should.equal(401);
      done();
    });
  });  
  
      it('should modify a specific user (barry101) with admin (adam101) token', function(done) {
    supertest(server)
    .put('/api/user/barry101')
    .set('Authorization', 'BEARER eyJhbGciOiJIUzI1NiJ9.YWRhbTEwMQ.8ll7ugQIlrdkorqAG06rKp85SX5RX2-yDSBPl3HR8XI')
    .send({'email': 'barryModified@bmail.com'})
    .expect('Content-type', /json/)
    .expect(200)
    .end(function(err, res) {
      res.status.should.equal(200);
      res.body.email.should.equal('barrymodified@bmail.com');
      done();
    });
  });
  
  
    it('should NOT modify a specific user (barry101) with another users (danny101: non-admin) token', function(done) {
    supertest(server)
    .put('/api/user/barry101')
    .set('Authorization', 'BEARER eyJhbGciOiJIUzI1NiJ9.ZGFubnkxMDE.Gy0IIgskxPslMHZxCbBTzJSIAWvNoBA5EcCLTpuc--k')
    .send({'email': 'barryModified@bmail.com'})
    .expect('Content-type', /json/)
    .expect(401)
    .end(function(err, res) {
      res.status.should.equal(401);
      done();
    });
  }); 
  
  
      it('should modify a specific user (barry101) with the users (barry101: non-admin) token', function(done) {
    supertest(server)
    .put('/api/user/barry101')
    .set('Authorization', 'BEARER eyJhbGciOiJIUzI1NiJ9.YmFycnkxMDE.eGpcujr8vIzlixPX0zrV7b2-yt6vf-wnrH9aQfRref8')
    .send({'email': 'barryModified@bmail.com'})
    .expect('Content-type', /json/)
    .expect(200)
    .end(function(err, res) {
      res.status.should.equal(200);
      res.body.email.should.equal('barrymodified@bmail.com');
      done();
    });
  });
  
  
        it('should NOT delete a specific user (adam101) without admin token', function(done) {
    supertest(server)
    .delete('/api/user/adam101')
    .expect('Content-type', /json/)
    .expect(401)
    .end(function(err, res) {
      res.status.should.equal(401);
      done();
    });
  });
  
      it('should delete a specific user (adam101) with admin (adam101) token', function(done) {
    supertest(server)
    .delete('/api/user/adam101')
    .set('Authorization', 'BEARER eyJhbGciOiJIUzI1NiJ9.YWRhbTEwMQ.8ll7ugQIlrdkorqAG06rKp85SX5RX2-yDSBPl3HR8XI')
    .expect('Content-type', /json/)
    .expect(200)
    .end(function(err, res) {
      res.status.should.equal(200);
      res.body.message.should.equal('User deleted');
      done();
    });
  });
  
      it('should NOT delete a specific user (barry101) with another users danny101) token', function(done) {
    supertest(server)
    .delete('/api/user/barry101')
    .set('Authorization', 'BEARER eyJhbGciOiJIUzI1NiJ9.ZGFubnkxMDE.Gy0IIgskxPslMHZxCbBTzJSIAWvNoBA5EcCLTpuc--k')
    .expect('Content-type', /json/)
    .expect(401)
    .end(function(err, res) {
      res.status.should.equal(401);
      done();
    });
  });
  
      it('should delete a specific user with the users token', function(done) {
    supertest(server)
    .delete('/api/user/barry101')
    .set('Authorization', 'BEARER eyJhbGciOiJIUzI1NiJ9.YmFycnkxMDE.eGpcujr8vIzlixPX0zrV7b2-yt6vf-wnrH9aQfRref8')
    .expect('Content-type', /json/)
    .expect(200)
    .end(function(err, res) {
      res.status.should.equal(200);
      res.body.message.should.equal('User deleted');
      done();
    });
  });
  
  
});
 

describe('Devices API unit test', function() {
  
    it('should NOT get all devices without valid token', function(done) {
    supertest(server)
    .get('/api/device')
    .expect('Content-type', /json/)
    .expect(401)
    .end(function(err, res) {
      res.status.should.equal(401);
      done();
    });
  }); 
  
    it('should get all devices with admin (Claire101) token', function(done) {
    supertest(server)
    .get('/api/device')
    .set('Authorization', 'BEARER eyJhbGciOiJIUzI1NiJ9.Y2xhaXJlMTAx.hlwNkvb-NsWNNCTrznxQEQmHlxdLO-UqOUOKiRPdeJQ')
    .expect('Content-type', /json/)
    .expect(200)
    .end(function(err, res) {
      res.status.should.equal(200);
      done();
    });
  }); 
  
  
  
    it('should NOT get a specific device (device0001) without valid token', function(done) {
    supertest(server)
    .get('/api/device/device0001')
    .expect('Content-type', /json/)
    .expect(401)
    .end(function(err, res) {
      res.status.should.equal(401);
      done();
    });
  }); 
  
    it('should get a specific device (device0001) with admin (Claire101) token', function(done) {
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
  
  
    it('should NOT create a device (device0003) without valid token', function(done) {
    supertest(server)
    .post('/api/device')
    .expect('Content-type', /json/)
    .send({'deviceName':'device0003'})
    .expect(401)
    .end(function(err, res) {
      res.status.should.equal(401);
      done();
    });
  }); 
  
    it('should create a device (device0003) with admin (Claire101) token', function(done) {
    supertest(server)
    .post('/api/device')
    .set('Authorization', 'BEARER eyJhbGciOiJIUzI1NiJ9.Y2xhaXJlMTAx.hlwNkvb-NsWNNCTrznxQEQmHlxdLO-UqOUOKiRPdeJQ')
    .expect('Content-type', /json/)
    .send({'deviceName':'device0003'})
    .expect(201)
    .end(function(err, res) {
      res.status.should.equal(201);
      done();
    });
  }); 

    it('should NOT modify a device (device0003) without valid token', function(done) {
    supertest(server)
    .put('/api/device/device0001')
    .expect('Content-type', /json/)
    .send({"maxTempWarning": 18})
    .expect(401)
    .end(function(err, res) {
      res.status.should.equal(401);
      done();
    });
  }); 
  
      it('should modify a device (device0003) with admin (Claire101) token', function(done) {
    supertest(server)
    .put('/api/device/device0001')
    .set('Authorization', 'BEARER eyJhbGciOiJIUzI1NiJ9.Y2xhaXJlMTAx.hlwNkvb-NsWNNCTrznxQEQmHlxdLO-UqOUOKiRPdeJQ')
    .expect('Content-type', /json/)
    .send({"maxTempWarning": 18})
    .expect(200)
    .end(function(err, res) {
      res.status.should.equal(200);
      done();
    });
  }); 
  
      it('should NOT modify a device (device0001) with non-registered owners (eddie101) token', function(done) {
    supertest(server)
    .put('/api/device/device0001')
    .set('Authorization', 'BEARER eyJhbGciOiJIUzI1NiJ9.ZWRkaWUxMDE.22U6dBqkmIsjRMD1bt-9uVOBKeFdXggBkGwCqVbq6GE')
    .expect('Content-type', /json/)
    .send({"maxTempWarning": 18})
    .expect(401)
    .end(function(err, res) {
      res.status.should.equal(401);
      done();
    });
  }); 
 
 
      it('should modify a device (device0001) with registered owners (danny101) token', function(done) {
    supertest(server)
    .put('/api/device/device0001')
    .set('Authorization', 'BEARER eyJhbGciOiJIUzI1NiJ9.ZGFubnkxMDE.Gy0IIgskxPslMHZxCbBTzJSIAWvNoBA5EcCLTpuc--k')
    .expect('Content-type', /json/)
    .send({"maxTempWarning": 18})
    .expect(200)
    .end(function(err, res) {
      res.status.should.equal(200);
      done();
    });
  }); 
  
      it('should NOT modify a journey (journey0001) with non-registered owners (eddie101) token', function(done) {
    supertest(server)
    .put('/api/device/device0001/journey/journey0001startDateTime')
    .set('Authorization', 'BEARER eyJhbGciOiJIUzI1NiJ9.ZWRkaWUxMDE.22U6dBqkmIsjRMD1bt-9uVOBKeFdXggBkGwCqVbq6GE')
    .expect('Content-type', /json/)
    .send({"finishDateTime": 'testDateTime'})
    .expect(401)
    .end(function(err, res) {
      res.status.should.equal(401);
      done();
    });
  }); 
 
 
      it('should modify a journey (journey0001) with registered owners (danny101) token', function(done) {
    supertest(server)
    .put('/api/device/device0001/journey/journey0001startDateTime')
    .set('Authorization', 'BEARER eyJhbGciOiJIUzI1NiJ9.ZGFubnkxMDE.Gy0IIgskxPslMHZxCbBTzJSIAWvNoBA5EcCLTpuc--k')
    .expect('Content-type', /json/)
    .send({"finishDateTime": 'testDateTime'})
    .expect(200)
    .end(function(err, res) {
      res.status.should.equal(200);
      done();
    });
  }); 
  
  
      it('should NOT register an owner (eddie101) with a device (device0002) without valid token', function(done) {
    supertest(server)
    .put('/api/device/device0002/registeredOwner')
    .expect('Content-type', /json/)
    .send({"registeredOwner": 'eddie101'})
    .expect(401)
    .end(function(err, res) {
      res.status.should.equal(401);
      done();
    });
  }); 
 
 
      it('should register an owner (eddie101) with a device (device0002) with valid token', function(done) {
    supertest(server)
    .put('/api/device/device0002/registeredOwner')
    .set('Authorization', 'BEARER eyJhbGciOiJIUzI1NiJ9.ZWRkaWUxMDE.22U6dBqkmIsjRMD1bt-9uVOBKeFdXggBkGwCqVbq6GE')
    .expect('Content-type', /json/)
    .send({"registeredOwner": 'eddie101'})
    .expect(200)
    .end(function(err, res) {
      res.status.should.equal(200);
      done();
    });
  }); 
  
  
      it('should NOT delete a device (device0002) without valid token', function(done) {
    supertest(server)
    .delete('/api/device/device0002')
    .expect('Content-type', /json/)
    .expect(401)
    .end(function(err, res) {
      res.status.should.equal(401);
      done();
    });
  }); 
 
 
       it('should NOT delete a device (device0001) with non-admin (danny101) token', function(done) {
    supertest(server)
    .delete('/api/device/device0002')
    .set('Authorization', 'BEARER eyJhbGciOiJIUzI1NiJ9.ZGFubnkxMDE.Gy0IIgskxPslMHZxCbBTzJSIAWvNoBA5EcCLTpuc--k')
    .expect('Content-type', /json/)
    .expect(401)
    .end(function(err, res) {
      res.status.should.equal(401);
      done();
    });
  }); 
 
 
      it('should delete a device (device0002) with admin (claire101) token', function(done) {
    supertest(server)
    .delete('/api/device/device0002')
    .set('Authorization', 'BEARER eyJhbGciOiJIUzI1NiJ9.Y2xhaXJlMTAx.hlwNkvb-NsWNNCTrznxQEQmHlxdLO-UqOUOKiRPdeJQ')
    .expect('Content-type', /json/)
    .expect(204)
    .end(function(err, res) {
      res.status.should.equal(204);
      done();
    });
  }); 
  
  
}); 
	