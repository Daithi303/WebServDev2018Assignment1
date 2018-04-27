import express from 'express';
import Model from './../model/model.js';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import json2xml from 'json2xml';
const router = express.Router(); 
var server = null;
import passport from './../../auth';


function init(serverIn) {
  server = serverIn;
  server.use(passport.initialize());
};
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

//Get a device (json and xml)
router.get('/:deviceId',passport.authenticate('jwt', {session: false }), (req, res) => {
  Model.Device.find({deviceName: req.params.deviceId}, (err, deviceArr) => {
    if (err) return handleError(res, err);
	 if (deviceArr.length==0) return res.status(404).json({Device: "Not found"});
    res.format({
		'application/xml': function(){
			return res.status(200).send(getDeviceInXml(convertAndFormatMongooseObjectToPlainObject(deviceArr[0])));
		},
		'application/json': function(){
			return res.status(200).send(convertAndFormatMongooseObjectToPlainObject(deviceArr[0]));
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
router.get('/',passport.authenticate('jwt', {session: false }), (req, res) => {
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
router.post('/',passport.authenticate('jwt', {session: false }), (req, res) => {
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
router.put('/:deviceId/registeredOwner',passport.authenticate('jwt', {session: false }), (req, res) => {
  if (req.body._id) delete req.body._id;
  if(!req.body.registeredOwner){
		return res.status(400).json({registeredOwner: "Request requires a valid registeredOwner property"});
	}
  var queryPromise = Model.User.find({userName: req.body.registeredOwner}).exec();
  queryPromise.then(
  function(userArr){
	  if (userArr.length==0) return res.status(400).json({registeredOwner: "There are no users with that object id. Cannot be registered as owner of the device"});
	  Model.Device.find({deviceName: req.params.deviceId}, (err, deviceArr) => {
    if (err) return handleError(res, err);
    if (deviceArr.length==0) return res.status(404).json({Device: "Not found"});
	var reqBodyRegisteredOwner = {registeredOwner: req.body.registeredOwner};
    const updated = _.merge(deviceArr[0], reqBodyRegisteredOwner);
    updated.save((err) => {
      if (err) return handleError(res, err);
      return res.status(200).send(convertAndFormatMongooseObjectToPlainObject(deviceArr[0]));
    });
  });

  },
  function(err){return handleError(res, err);}
  );
});

//Get a registered owner (user) of a device
router.get('/:deviceId/registeredOwner', (req, res) => {
  
  Model.Device.find({unserName: req.params.deviceId}, (err, deviceArr) => {
    if (err) return handleError(res, err);
    if (deviceArr==0) return res.status(404).json({Device: "Not found"});
	if(deviceArr[0].registeredOwner == null){
		return res.status(404).json({registeredOwner: null});
	}
	return res.status(200).json({registeredOwner: deviceArr[0].registeredOwner});
  });
});


//Create a journey
router.post('/:deviceId/journey',passport.authenticate('jwt', {session: false }), (req, res) => {
        let newJourney = req.body;
        if (newJourney){
			if(!newJourney.initiator){
				return res.status(400).json({initiator: "Request requires a valid initiator property"});
			}
			var queryPromise = Model.User.find({userName: req.body.initiator}).exec();
			queryPromise.then(
			function(userArr){
			if (userArr.length==0) return res.status(404).json({initiator: "There are no users with that object id. Journey cannot be created with the provided id"});	
			Model.Device.find({deviceName: req.params.deviceId}, (err, deviceArr) => {
			 if (err) return handleError(res, err);
			 if (deviceArr.length==0) return res.status(404).json({Device: "Not found"});
			deviceArr[0].journey.push({initiator: newJourney.initiator});
			deviceArr[0].save((err,deviceReturned) => {
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
			Model.Device.find({deviceName: req.params.deviceId}, (err, deviceArr) => {
			 if (err) return handleError(res, err);
			 if (deviceArr.length==0) return res.status(404).json({Device: "Not found"});
			 var journeyArray = [];
			 deviceArr[0].journey.forEach(function(journey){
				 journeyArray.push(convertAndFormatMongooseObjectToPlainObject(journey));
			 });
			 if(journeyArray.length == 0){return res.status(404).json({Journey: "Not found"});}
			  return res.status(200).send(journeyArray);
			});	
});

//Get a specific journey in a device
router.get('/:deviceId/journey/:journeyId',(req, res)=>{
			Model.Device.find({deviceName: req.params.deviceId}, (err, deviceArr) => {
			 if (err) return handleError(res, err);
			 if (deviceArr.length==0) return res.status(404).json({Device: "Not found"});
			 var journeyArray = [];
			 deviceArr[0].journey.forEach(function(journey){
				 if(journey.startDateTime == req.params.journeyId){
					  journeyArray.push(convertAndFormatMongooseObjectToPlainObject(journey));
				 }
			 });
			 if(journeyArray.length == 0){return res.status(404).json({Journey: "Not found"});}
			  return res.status(200).send(journeyArray[0]);
			});	
});

// Update a journey in a device
router.put('/:deviceId/journey/:journeyId',passport.authenticate('jwt', {session: false }), (req, res) => {
	if (req.body._id) delete req.body._id;
	Model.Device.find({deviceName: req.params.deviceId},(err,deviceArr)=>{
			if (err) return handleError(res, err);
	    if (deviceArr.length==0) return res.status(404).json({Device: "Not found"});
	    var device = deviceArr[0];
	    let journey = null;
		let journeyArr = device.journey;
		for(var i=0;i<journeyArr.length;i++){
			if(journeyArr[i].startDateTime===req.params.journeyId){
				journey = journeyArr[i];
			}
		}
		if(!journey) return res.status(404).json({Journey: "Not found"});
		if(!req.body.finishDateTime && !req.body.journeyState) return res.status(400).json({journey: "Request requires either a valid finishDateTime property or a journeyState property"});
		if(req.body.finishDateTime) journey.finishDateTime = req.body.finishDateTime;
		if(req.body.journeyState) journey.journeyState = req.body.journeyState;
		deviceArr[0].save((err)=>{
		if (err) {return handleError(res, err);}
		else
		{return  res.status(200).send(convertAndFormatMongooseObjectToPlainObject(journey));}
	});
	});
	});


// Update a device
router.put('/:deviceId',passport.authenticate('jwt', {session: false }), (req, res) => {
  if (req.body._id) delete req.body._id;
  if (req.body.registeredOwner || req.body.journey) return res.status(400).json({Device: "Updates involving the registeredOwner and/or journey properties are performed through different api routes"});
  Model.Device.find({deviceName: req.params.deviceId}, (err, deviceArr) => {
    if (err) return handleError(res, err);
    if (deviceArr.length==0) return res.status(404).json({Device: "Not found"});
    const updated = _.merge(deviceArr[0], req.body);
    updated.save((err) => {
      if (err) return handleError(res, err);
      return res.status(200).json(deviceArr[0]);
    });
  });
});

// Delete a device
router.delete('/:deviceId',passport.authenticate('jwt', {session: false }), (req, res) => {
  Model.Device.find({deviceName: req.params.deviceId}, (err, deviceArr) => {
    if (err) return handleError(res, err);
    if (deviceArr.length==0) return res.send(404);
    deviceArr[0].remove(function(err) {
      if (err) return handleError(res, err);
      return res.status(204).send();
    });
  });
});

function handleError(res, err) {
  return res.status(500).send(err);
};

module.exports = {
	router: router,
	init: init	
};