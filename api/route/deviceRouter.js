import express from 'express';
import Model from './../model/model.js';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import json2xml from 'json2xml';
const router = express.Router(); 
//var server = null;

import {server} from './../../index.js';

/*
function init(serverIn) {
  server = serverIn;
};

*/
//this function converts the plain object to an xml object
function getDeviceInXml(deviceObj){
			 var objId = {value: deviceObj._id.toString()};
			deviceObj._id = objId;
			var response = json2xml({device: deviceObj});
			return response;
}

function convertAndFormatMongooseObjectToPlainObject(device){
	var deviceObj = device.toObject();
	return deviceObj;
}

//Authenticate with token
router.use(
function(req, res, next) {
  var token = req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, server.get('superSecret'), function(err, decoded) {      
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

//Get a device (json and xml)
router.get('/:deviceId', (req, res) => {
  Model.Device.findById(req.params.deviceId, (err, device) => {
    if (err) return handleError(res, err);
	 if (!device) return res.status(404).json({Device: "Not found"});
    res.format({
		'application/xml': function(){
			return res.status(200).send(getDeviceInXml(convertAndFormatMongooseObjectToPlainObject(device)));
		},
		'application/json': function(){
			return res.status(200).send(convertAndFormatMongooseObjectToPlainObject(device));
		}
		
	});
  });
});
/*
router.get('/:deviceId', (req, res) => {
  Model.Device.findById(req.params.deviceId, (err, device) => {
    if (err) return handleError(res, err);
    res.format({
		'application/xml': function(){
			var deviceObj = device.toObject();
			 var objId = {value: deviceObj._id.toString()};
			deviceObj._id = objId;
			var response = json2xml({device: deviceObj});
			return res.status(200).send(response);
		},
		'default': function(){
			return res.status(200).json(device);
		}
	});
  });
});
*/

//Get all devices (json and xml)
router.get('/', (req, res) => {
  Model.Device.find((err, devices) => {
    if (err) return handleError(res, err);
	 if (!devices) return res.status(404).json({Devices: "Not found"});
    res.format({
		'application/xml': function(){
			var response = '';
			devices.forEach(function(device) {
			response = response + getDeviceInXml(convertAndFormatMongooseObjectToPlainObject(device));
});
			return res.status(200).send('<devices>'+response+'</devices>');
		},
		'application/json': function(){
			var deviceObjArray = [];
			devices.forEach(function(device) {
			deviceObjArray.push(convertAndFormatMongooseObjectToPlainObject(device));
			});
			return res.status(200).send(deviceObjArray);
		}
	});
  });
});

/*
router.get('/', (req, res) => {
  Model.Device.find((err, devices) => {
    if (err) return handleError(res, err);
    res.format({
		'application/xml': function(){
			var response = '';
			var deviceObj = null;
			devices.forEach(function(element) {
  deviceObj = element.toObject();
  var objId = {value: deviceObj._id.toString()};
  deviceObj._id = objId;
  response = response + json2xml({device: deviceObj});
});
			return res.status(200).send('<device>'+response+'</device>');
		},
		'application/json': function(){
			console.log('default');
			return res.status(200).json(devices);
		}		
	});
  });
});
*/

//Add a device
router.post('/', (req, res) => {
  Model.Device.create(req.body, function(err, device) {
    if (err) return handleError(res, err);
    return res.status(201).send(convertAndFormatMongooseObjectToPlainObject(device));
  });
});


//Register a user as the owner of a device
/*
router.put('/:deviceId/registeredOwner', (req, res) => {
  if (req.body._id) delete req.body._id;
  Model.Device.findById(req.params.deviceId, (err, device) => {
    if (err) return handleError(res, err);
    if (!device) return res.status(404).json({Device: "Not found"});
	if(!req.body.registeredOwner){
		return res.status(400).json({registeredOwner: "Request requires a valid registeredOwner property"});
	}
    const updated = _.merge(device, req.body.registeredOwner);
    updated.save((err) => {
      if (err) return handleError(res, err);
      return res.status(200).send(convertAndFormatMongooseObjectToPlainObject(device));
    });
  });
});
*/

//Register a user as the owner of a device
router.put('/:deviceId/registeredOwner', (req, res) => {
  if (req.body._id) delete req.body._id;
  if(!req.body.registeredOwner){
		return res.status(400).json({registeredOwner: "Request requires a valid registeredOwner property"});
	}
  var queryPromise = Model.User.findById(req.body.registeredOwner).exec();
  queryPromise.then(
  function(user){
	  if (!user) return res.status(400).json({registeredOwner: "There are no users with that object id. Cannot be registered as owner of the device"});
	  Model.Device.findById(req.params.deviceId, (err, device) => {
    if (err) return handleError(res, err);
    if (!device) return res.status(404).json({Device: "Not found"});
	var reqBodyRegisteredOwner = {registeredOwner: req.body.registeredOwner};
    const updated = _.merge(device, reqBodyRegisteredOwner);
    updated.save((err) => {
      if (err) return handleError(res, err);
      return res.status(200).send(convertAndFormatMongooseObjectToPlainObject(device));
    });
  });

  },
  function(err){return handleError(res, err);}
  );
});

//Get a registered owner (user) of a device
router.get('/:deviceId/registeredOwner', (req, res) => {
  
  Model.Device.findById(req.params.deviceId, (err, device) => {
    if (err) return handleError(res, err);
    if (!device) return res.status(404).json({Device: "Not found"});
	if(device.registeredOwner == null){
		return res.status(404).json({registeredOwner: null});
	}
	return res.status(200).json({registeredOwner: device.registeredOwner});
  });
});


//Create a journey
router.post('/:deviceId/journey', (req, res) => {
        let newJourney = req.body;
        if (newJourney){
			if(!newJourney.initiator){
				return res.status(400).json({initiator: "Request requires a valid initiator property"});
			}
			var queryPromise = Model.User.findById(req.body.initiator).exec();
			queryPromise.then(
			function(user){
			if (!user) return res.status(404).json({initiator: "There are no users with that object id. Journey cannot be created with the provided id"});	
			Model.Device.findById(req.params.deviceId, (err, device) => {
			 if (err) return handleError(res, err);
			 if (!device) return res.status(404).json({Device: "Not found"});
			device.journey.push({initiator: newJourney.initiator});
			device.save((err,deviceReturned) => {
				if (err) return handleError(res, err);
				res.status(201).send(deviceReturned.journey[deviceReturned.journey.length-1]);
			}		
			);
			});		
			},
			function(err){return handleError(res, err);}
			);
          
      }else{
            res.status(400).send({message: "Unable to find journey in request. No journey found in body"});
      }
});

//Get all journeys in a device
router.get('/:deviceId/journey',(req, res)=>{
			Model.Device.findById(req.params.deviceId, (err, device) => {
			 if (err) return handleError(res, err);
			 if (!device) return res.status(404).json({Device: "Not found"});
			 var journeyArray = [];
			 device.journey.forEach(function(journey){
				 journeyArray.push(convertAndFormatMongooseObjectToPlainObject(journey));
			 });
			 if(journeyArray.length == 0){return res.status(404).json({Journey: "Not found"});}
			  return res.status(200).send(journeyArray);
			});	
});

//Get a specific journey in a device
router.get('/:deviceId/journey/:journeyId',(req, res)=>{
			Model.Device.findById(req.params.deviceId, (err, device) => {
			 if (err) return handleError(res, err);
			 if (!device) return res.status(404).json({Device: "Not found"});
			 var journeyArray = [];
			 device.journey.forEach(function(journey){
				 if(journey._id == req.params.journeyId){
					  journeyArray.push(convertAndFormatMongooseObjectToPlainObject(journey));
				 }
			 });
			 if(journeyArray.length == 0){return res.status(404).json({Journey: "Not found"});}
			  return res.status(200).send(journeyArray);
			});	
});

// Update a journey in a device
router.put('/:deviceId/journey/:journeyId', (req, res) => {
	if (req.body._id) delete req.body._id;
	Model.Device.findById(req.params.deviceId,(err,device)=>{
			if (err) return handleError(res, err);
	    if (!device) return res.status(404).json({Device: "Not found"});
		let journey = device.journey.id(req.params.journeyId);
		if(!journey) return res.status(404).json({Journey: "Not found"});
		if(!req.body.finishDateTime && !req.body.journeyState) return res.status(400).json({journey: "Request requires either a valid finishDateTime property or a journeyState property"});
		if(req.body.finishDateTime) journey.finishDateTime = req.body.finishDateTime;
		if(req.body.journeyState) journey.journeyState = req.body.journeyState;
		device.save((err)=>{
		if (err) {return handleError(res, err);}
		else
		{return  res.status(200).send(convertAndFormatMongooseObjectToPlainObject(journey));}
	});
	});
	});


// Update a journey in a device
/*
router.put('/:deviceId/journey/:journeyId', (req, res) => {
	
  if (req.body._id) delete req.body._id;
  if (req.body.initiator) return res.status(400).json({Device: "The initiator property canot be modified after journey creation. Please remove this property from request body"});
   if (req.body.startDateTime) return res.status(400).json({Device: "The startDateTime property canot be modified after journey creation. Please remove this property from request body"});
  Model.Device.findById(req.params.deviceId, (err, device) => {
    if (err) return handleError(res, err);
     if (!device) return res.status(404).json({Device: "Not found"});
	 var journeyIn =  req.body;
	 var journeyFound = false;
	device.journey.forEach(function(journey){
	if(journey._id == req.params.journeyId){	
		journeyFound = true;
		journeyIn._id = req.params.journeyId;
		if(req.params.finishDateTime){journeyIn.finishDateTime = req.params.finishDateTime;}else{journeyIn.finishDateTime = journey.finishDateTime;}
		if(req.params.journeyState){journeyIn.journeyState = req.params.journeyState;}else{journeyIn.journeyState = journey.journeyState;}
	device.update(
	{'journey._id': req.params.journeyId},
	{'$set': {
    'journey.$.finishDateTime': journeyIn.finishDateTime,
     'journey.$.journeyState': journeyIn.journeyState
}},function(err) {
	if (err) return handleError(res, err);
	    device.save((err) => {
      if (err) return handleError(res, err);
      return res.status(200).json(device);
    });
}
	);

	}
	});
	if(journeyFound == false){return res.status(404).json({Journey: "Not found"});}
  });
});
*/

/*
router.post('/:deviceId/journey', (req, res) => {
        let newJourney = req.body;
        if (newJourney){
			Model.Device.findById(req.params.deviceId, (err, device) => {
			 if (err) return handleError(res, err);
			 if (!device) return res.status(404).json({Device: "Not found"});
			device.journey.push({initiator: newJourney.initiator});
			device.save((err,deviceReturned) => {
				if (err) return handleError(res, err);
				res.status(201).send(deviceReturned.journey[deviceReturned.journey.length-1]);
			}		
			);
			});		          
      }else{
            res.status(400).send({message: "Unable to find journey in request. No journey found in body"});
      }
});
*/

// Update a device
router.put('/:deviceId', (req, res) => {
  if (req.body._id) delete req.body._id;
  if (req.body.registeredOwner || req.body.journey) return res.status(400).json({Device: "Updates involving the registeredOwner and/or journey properties are performed through different api routes"});
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

function handleError(res, err) {
  return res.send(500, err);
};

module.exports = {
	router: router
	//,
//	init: init	
};