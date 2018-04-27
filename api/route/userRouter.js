import express from 'express';
import Model from './../model/model.js';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import json2xml from 'json2xml';
const router = express.Router(); 
import userEvent from './../../events.js';
var server = null;
import passport from './../../auth';


function init(serverIn) {
  server = serverIn;
  server.use(passport.initialize());
};

//this function converts the mongoose object to a plain object so the salt and hashed password properties can be removed before sending the object as a response
function convertAndFormatMongooseObjectToPlainObject(user){
	var userObj = user.toObject();
	//userObj = removeSaltAndHash(userObj);
	return userObj;
}

//this function converts the plain object to an xml object
function getUserInXml(userObj){
			 var objId = {value: userObj._id.toString()};
			userObj._id = objId;
			var response = json2xml({user: userObj});
			return response;
}

//Get a user (json and xml)
router.get('/:userId',passport.authenticate('jwt', {session: false }), (req, res) => {
  Model.User.find({userName: req.params.userId}, (err, user) => {
    if (err) return handleError(res, err);
	 if (!user) return res.status(404).json({User: "Not found"});
    res.format({
		'application/xml': function(){
			return res.status(200).send(getUserInXml(convertAndFormatMongooseObjectToPlainObject(user[0])));
		},
		'application/json': function(){
			return res.status(200).send(convertAndFormatMongooseObjectToPlainObject(user[0]));
		}
	});
  });
});

//Get all users (json and xml)
router.get('/', passport.authenticate('jwt', {session: false }), (req, res) => {
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
/*
router.post('/', (req, res) => {
   if (req.body._id) delete req.body._id;
   //if (req.body.hashedPassword) {delete req.body.hashedPassword;}
  Model.User.create(req.body, function(err, user) {
    if (err) return handleError(res, err);
    userEvent.publish('create_user_event', user);
    return res.status(201).send(convertAndFormatMongooseObjectToPlainObject(user));
  });
});
*/

//register/login a user (to replace the Add a user route)
//////////////////////////////////////////////
router.post('/', asyncHandler(async (req, res) => {
  if (!req.body.userName || !req.body.password) {
    res.status(401).json({
      success: false,
      msg: 'Please pass username and password.',
    });
  };
  if (req.query.action === 'register') {
    const newUser = new Model.User({
  fName: req.body.fName,
  lName: req.body.lName,
  streetAddress1: req.body.streetAddress1,
  streetAddress2: req.body.streetAddress2,
  townCity: req.body.townCity,
  countyState: req.body.countyState,
  email: req.body.email,
  userName: req.body.userName,
  password: req.body.password,
  admin: req.body.admin
    });
    // save the user
    await newUser.save();
    userEvent.publish('create_user_event', newUser);
    return res.status(201).send(convertAndFormatMongooseObjectToPlainObject(newUser));
  } else {
    const user = await Model.User.findOne({
      userName: req.body.userName,
    });
    if (!user) return res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (isMatch && !err) {
        // if user is found and password is right create a token
        const token = jwt.sign(user.userName, process.env.jwtSecret);
        // return the information including token as JSON
        res.status(200).json({
          success: true,
          token: 'JWT ' + token,
        });
      } else {
        res.status(401).send({
          success: false,
          msg: 'Authentication failed. Wrong password.',
        });
      }
    });
  };
}));
///////////////////////////////////////////////


// Update a user
router.put('/:userId',passport.authenticate('jwt', {session: false }), (req, res) => {
  if (req.body._id) delete req.body._id;
  Model.User.find({userName: req.params.userId}, (err, user) => {
    if (err) return handleError(res, err);
    if (!user) return res.send(404);
    const updated = _.merge(user[0], req.body);
    updated.save((err) => {
      if (err) return handleError(res, err);
      return res.status(200).send(convertAndFormatMongooseObjectToPlainObject(user[0]));
    });
  });
});

// Delete a user
router.delete('/:userId',passport.authenticate('jwt', {session: false }), (req, res) => {
  Model.User.find({userName: req.params.userId}, (err, user) => {
    if (err) return handleError(res, err);
    if (!user) return res.send(404);
    user[0].remove(function(err) {
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

