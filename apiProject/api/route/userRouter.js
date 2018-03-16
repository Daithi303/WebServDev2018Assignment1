import express from 'express';
import Model from './../model/model.js';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import json2xml from 'json2xml';
const router = express.Router(); 
var server = null;

function init(serverIn) {
  server = serverIn;
};


//this function converts the mongoose object to a plain object so the salt and hashed password properties can be removed before sending the object as a response
function convertAndFormatMongooseObjectToPlainObject(user){
	var userObj = user.toObject();
	userObj = removeSaltAndHash(userObj);
	return userObj;
}

//this function removes the salt and hashedPassword properties from the plain object
function removeSaltAndHash(userObj){
	delete userObj.hashedPassword;
	delete userObj.salt;
	return userObj;
}

//this function converts the plain object to an xml object
function getUserInXml(userObj){
			 var objId = {value: userObj._id.toString()};
			userObj._id = objId;
			var response = json2xml({user: userObj});
			return response;
}

//Authenticate with token
router.use(
function(req, res, next) {
  var token = req.headers['x-access-token'];
  if (token) {
	  var secret = server.get('superSecret');
    jwt.verify(token, secret, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });   	
      } else {
        req.decoded = decoded;    
        next();
      }
    });

  } else {
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
}
);

//Get a user (json and xml)
router.get('/:userId', (req, res) => {
  Model.User.findById(req.params.userId, (err, user) => {
    if (err) return handleError(res, err);
	 if (!user) return res.status(404).json({User: "Not found"});
    res.format({
		'application/xml': function(){
			return res.status(200).send(getUserInXml(convertAndFormatMongooseObjectToPlainObject(user)));
		},
		'application/json': function(){
			return res.status(200).send(convertAndFormatMongooseObjectToPlainObject(user));
		}
	});
  });
});

//Get all users (json and xml)
router.get('/', (req, res) => {
  Model.User.find((err, users) => {
    if (err) return handleError(res, err);
	 if (!users) return res.status(404).json({Users: "Not found"});
    res.format({
		'application/xml': function(){
			var response = '';
			users.forEach(function(user) {
			response = response + getUserInXml(convertAndFormatMongooseObjectToPlainObject(user));
});
			return res.status(200).send('<users>'+response+'</users>');
		},
		'application/json': function(){
			var userObjArray = [];
			users.forEach(function(user) {
			userObjArray.push(convertAndFormatMongooseObjectToPlainObject(user));
			});
			
			return res.status(200).send(userObjArray);
		}
		
	});
  });
});

//Add a user
router.post('/', (req, res) => {
   if (req.body._id) delete req.body._id;
   if (req.body.hashedPassword) {delete req.body.hashedPassword;}
  Model.User.create(req.body, function(err, user) {
    if (err) return handleError(res, err);
    return res.status(201).send(convertAndFormatMongooseObjectToPlainObject(user));
  });
});

// Update a user
router.put('/:userId', (req, res) => {
  if (req.body._id) delete req.body._id;
   if (req.body.hashedPassword) {delete req.body.hashedPassword;}
  Model.User.findById(req.params.userId, (err, user) => {
    if (err) return handleError(res, err);
    if (!user) return res.send(404);
    const updated = _.merge(user, req.body);
    updated.save((err) => {
      if (err) return handleError(res, err);
      return res.status(200).send(convertAndFormatMongooseObjectToPlainObject(user));
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
      return res.status(200).json({message: "User deleted"});
    });
  });
});


function handleError(res, err) {
  return res.send(500, err);
};

module.exports = {
	router: router,
	init: init	
};

