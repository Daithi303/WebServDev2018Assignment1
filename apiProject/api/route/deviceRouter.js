import express from 'express';
import Model from './../model/model.js';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
const router = express.Router(); // eslint-disable-line
var server = null;

function init(serverIn) {
  server = serverIn;
  //console.log('deviceRouter.init server.get value: '+ server.get('superSecret'))
};

router.use(
function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token'];
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, server.get('superSecret'), function(err, decoded) {      
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
//Get all devices
router.get('/', (req, res) => {
  Model.Device.find((err, device) => {
    if (err) return handleError(res, err);
    return res.status(200).json(device);
  });
});

//Get a device
router.get('/:deviceId', (req, res) => {
  Model.Device.findById(req.params.deviceId, (err, device) => {
    if (err) return handleError(res, err);
    return res.status(200).json(device);
  });
});

//Add a device
router.post('/', (req, res) => {
  Model.Device.create(req.body, function(err, device) {
    if (err) return handleError(res, err);
    return res.status(201).json(device);
  });
});


//Register a user with a device
router.put('/:deviceId/registeredUser', (req, res) => {
  if (req.body._id) delete req.body._id;
  Model.Device.findById(req.params.deviceId, (err, device) => {
    if (err) return handleError(res, err);
    if (!device) return res.status(404).json({Device: "Not found"});
    const updated = _.merge(device, req.body);
    updated.save((err) => {
      if (err) return handleError(res, err);
      return res.status(200).json(device);
    });
  });
});

//Get a registered user of a device
router.get('/:deviceId/registeredUser', (req, res) => {
  if (req.body._id) delete req.body._id;
  Model.Device.findById(req.params.deviceId, (err, device) => {
    if (err) return handleError(res, err);
    if (!device) return res.status(404).json({Device: "Not found"});
	if(device.registeredUser == null){
		return res.status(404).json({registeredUser: null});
	}
	Model.User.findById(device.registeredUser, (err, user) => {
		if (err) return handleError(res, err);
		 if (!user) return res.send(404);
		 return res.status(200).json(user);
	});
	//var registeredUser = {registeredUser: device.registeredUser};
	//return res.status(200).json(registeredUser);
  });
});
/*
var query = {'_id':deviceId};
req.newData.username = req.user.username;
MyModel.findOneAndUpdate(query, req.newData, {upsert:true}, function(err, doc){
    if (err) return res.send(500, { error: err });
    return res.send("succesfully saved");
});
*/
/*
//Register a device with a user
router.post('/:deviceId/registeredDevices', (req, res) => {
   const userId = req.params.deviceId;
   const device = req.body;
   Model.User.findById(id, (err, user)=>{
     if (err) return handleError(res, err);
        user.registeredDevices.push(device);
        user.save((err) => {
          if (err) return handleError(res, err);
           return res.status(201).send({user});
        }
   });
});
*/

// Update a device
router.put('/:deviceId', (req, res) => {
  if (req.body._id) delete req.body._id;
  Model.Device.findById(req.params.deviceId, (err, device) => {
    if (err) return handleError(res, err);
    if (!device) return res.send(404);
    const updated = _.merge(device, req.body);
    updated.save((err) => {
      if (err) return handleError(res, err);
      return res.status(200).json(device);
    });
  });
});

// Delete a device
router.delete('/:deviceId', (req, res) => {
  Model.Device.findById(req.params.deviceId, (err, device) => {
    if (err) return handleError(res, err);
    if (!device) return res.send(404);
    device.remove(function(err) {
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