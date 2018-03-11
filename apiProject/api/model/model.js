import mongoose from 'mongoose';
import randToken from 'rand-token';
import crypto from 'crypto';
const Schema = mongoose.Schema;

import arrayUniquePlugin from 'mongoose-unique-array';
var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

const JourneySchema = new Schema(
{
	initiator: {
		type: Schema.Types.ObjectId, ref: 'User',
		required: true
	},
	startDateTime: {
		type : Date, 
		default: Date.now 
	},
	finishDateTime: {
		type : Date, 
		default: Date.now 
	},
	journeyState: {
		type: String,
		enum: ['inProgress', 'paused', 'complete'],
		default: 'inProgress'
	},
});

const DeviceSchema = new Schema({
	deviceName: {
		type: String,
		default: function() {
			var devicePrefix = "device_"
			var deviceSuffix =  randToken.generate(8);
			var deviceName = devicePrefix+deviceSuffix;
		return deviceName;}
	},
	minTempWarning: {
		type: Number,
		default: 2
	},
	maxTempWarning: {
		type: Number,
		default: 18
	},
	minutesToWaitBeforeSecondaryAlert: {
		type: Number,
		default:5
	},
	minutesAllowedForJourneyPause: {
		type: Number,
		default:5
	},
  registeredUser: { 
  type: Schema.Types.ObjectId,
  ref: 'User'
  },
	journey: [JourneySchema]
});

var Device =  mongoose.model('Device', DeviceSchema);
/*
var deviceExists = function(value,respond) {
	//console.log("Current value in deviceExists: "+ value);
Device.findOne({_id: value}, function(err, device) {
    if(err) throw err;
    if(device) {
		console.log("Device Found");
		return respond(true);}
	else{
    console.log("Device NOT Found");
    return respond(false);
	}
  });
};

  var deviceIsNotYetRegistered = function(value, respond) {
 User.find({registeredDevices: {_id: value} } , function(err, registeredDevice) {	
    if(err) {console.log("Error was thrown");throw err;};
    if(registeredDevice != null) {
		console.log("Device already registered: " + registeredDevice);
		return respond(false);
    }
	else{
	console.log("Device NOT registered: "+ registeredDevice);
    return respond(true);}
	
  }

);
};



//{ validator: deviceIsNotYetRegistered, msg: 'Device is already registered' }
//{ validator: deviceExists, msg: 'Device does not exist.' }
var manyValidators = [
    {
  isAsync: true,
  validator: deviceIsNotYetRegistered, msg: 'Device is already registered' }
];
*/

const UserSchema = new Schema({
  fName: {
        type: String,
        required: true
      },
  lName: {
        type: String,
        required: true
      },
  streetAddress1: {
        type: String,
        required: true
      },
  streetAddress2: {
        type: String
      },
  townCity:{
        type: String,
        required: true
      },
  countyState: {
        type: String,
        required: true
      },
  email: {
  type: String,
  lowercase: true
  },
  dateOfBirth: {
    type: Date,
	required: true,
	default: Date.now
  },
  userName: {
  type: String,
  required: true
  },
  hashedPassword: {
  type: String,
  required: true
  },
  salt: {
        type: String,
        required: true
    },
	admin: {
		type: Boolean,
		required: true,
		default: false
	}
});

UserSchema.virtual('password')
    .set(function (password) {
		//this.salt = crypto.randomBytes(32).toString('base64');
        this.salt = "aHNkNzM1MzkzZ2RoZDkzNzNnZWk4ZGhlOTkyODNnZGs=";
        this.hashedPassword = this.encryptPassword(password, this.salt);
    })
    .get(function () {
        return this.hashedPassword;
    });

UserSchema.methods.encryptPassword = function (password, salt) {
    return crypto.createHmac('sha1', salt).update(password).digest('hex');
};

/*
UserSchema.methods.checkPassword = function (password) {
return "inside checkPassword method: "+ password;
};
*/

UserSchema.methods.checkPassword = function (password) {
    return this.encryptPassword(password, this.salt) === this.hashedPassword;
};

var User = mongoose.model('User', UserSchema);

/*
UserSchema.path('registeredDevices').validate({
  isAsync: true,
  validator: function (value, respond) {
	  var lastEntry = value.length-1;
	  console.log("Value: "+ value[lastEntry]);
  Device.findOne({_id: value[lastEntry]}, function(err, user) {
    if(err) throw err;
    if(user) {
		console.log("User Found");
		return respond(true);}
	else{
    console.log("User NOT Found");
    respond(false);
	}
  });
  },
  message: 'That device does not exist.' // Optional
});
*/

module.exports = {
	Device: Device,
	User: User	
};