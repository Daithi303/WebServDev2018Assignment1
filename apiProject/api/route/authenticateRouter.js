import express from 'express';
import Model from './../model/model.js';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
const router = express.Router(); // eslint-disable-line
var server = null;

function init(serverIn) {
  server = serverIn;
  console.log('authenticateRouter.init server.get value: '+ server.get('superSecret'))
};
//Get all users
router.post('/', (req, res) => {
Model.User.findOne({
    userName: req.body.userName
  }, function(err, user) {

    if (err) return handleError(res, err);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Authentication failed. User not found.' });
    } else{
		//console.log('User exists');
		var passwordIsRight = user.checkPassword(req.body.password);
		//console.log('passwordIsRight: '+ passwordIsRight);
      // check if password matches
      if (passwordIsRight == false) {
		  //console.log('Authentication failed. Wrong password.');
        return res.status(404).json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
//console.log('User is Found and the password is right.');
        // if user is found and password is right
        // create a token with only our given payload
    // we don't want to pass in the entire user since that has the password
    const payload = {
      admin: user.admin 
    };
	
        var token = jwt.sign(payload, server.get('superSecret'), {
          expiresIn: 60*60*24
        });

var superSecret = server.get('superSecret');
        return res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   


    }

  });
});



function handleError(res, err) {
  return res.send(500, err);
};

module.exports = {
	router: router,
	init: init	
};