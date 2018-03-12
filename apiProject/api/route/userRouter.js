import express from 'express';
import Model from './../model/model.js';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import json2xml from 'json2xml';
const router = express.Router(); // eslint-disable-line
var server = null;

function init(serverIn) {
  server = serverIn;
 // console.log('userRouter.init server.get value: '+ server.get('superSecret'))
};

router.use(
function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token'];
  if (token) {
	 // console.log("token: "+token);
	  var secret = server.get('superSecret');
	  //console.log("secret: "+secret);
    jwt.verify(token, secret, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });   	
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {
    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
}
);


//Get all users
/*
router.get('/', (req, res) => {
  Model.User.find((err, user) => {
    if (err) return handleError(res, err);
    return res.status(200).json(user);
  });
});
*/

router.get('/:userId', (req, res) => {
  Model.User.findById(req.params.userId, (err, user) => {
    if (err) return handleError(res, err);
    res.format({
		'application/xml': function(){
			console.log('application/XML');
			var userObj = user.toObject();
			console.log('userObj: '+userObj);
			var response = json2xml({user: userObj});
			console.log('response xml: '+response);
			return res.status(200).send(response);
		},
		'default': function(){
			console.log('default');
			return res.status(200).json(user);
		}
		
	});
  });
});

router.get('/', (req, res) => {
  Model.User.find((err, users) => {
    if (err) return handleError(res, err);
	
    res.format({
		'application/xml': function(){
			var response = '';
			var userObj = null;
			console.log('application/XML');
			users.forEach(function(element) {
  console.log('Each userName: '+element.userName);
  userObj = element.toObject();
  response = response + json2xml({user: userObj});
});
			return res.status(200).send('<users>'+response+'</users>');
		},
		'default': function(){
			console.log('default');
			return res.status(200).json(users);
		}
		
	});
  });
});


/*
//Get a user
router.get('/:userId', (req, res) => {
  Model.User.findById(req.params.userId, (err, user) => {
    if (err) return handleError(res, err);
    return res.status(200).json(user);
  });
});
*/

//Add a user
router.post('/', (req, res) => {
  Model.User.create(req.body, function(err, user) {
    if (err) return handleError(res, err);
    return res.status(201).json(user);
  });
});




// Update a user
router.put('/:userId', (req, res) => {
  if (req.body._id) delete req.body._id;
  Model.User.findById(req.params.userId, (err, user) => {
    if (err) return handleError(res, err);
    if (!user) return res.send(404);
    const updated = _.merge(user, req.body);
    updated.save((err) => {
      if (err) return handleError(res, err);
      return res.status(200).json(user);
    });
  });
});

// Delete a user
router.delete('/:userId', (req, res) => {
  Model.User.findById(req.params.userId, (err, user) => {
    if (err) return handleError(res, err);
    if (!user) return res.send(404);
    user.remove(function(err) {
      if (err) return handleError(res, err);
      return res.send(204);
    });
  });
});

/**
 * Handle general errors.
 * @param {object} res The response object
 * @param {object} err The error object.
 * @return {object} The response object
 */
function handleError(res, err) {
  return res.send(500, err);
};


module.exports = {
	router: router,
	init: init	
};

//export default router;
