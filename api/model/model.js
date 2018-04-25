import mongoose from 'mongoose';
import randToken from 'rand-token';
import crypto from 'crypto';
const Schema = mongoose.Schema;
import moment from 'moment';
import arrayUniquePlugin from 'mongoose-unique-array';
import bcrypt from  'bcrypt-nodejs';

const JourneySchema = new Schema(
{
	initiator: {
		type: Schema.Types.ObjectId, 
		ref: 'User',
		required: true
	},
	startDateTime: {
		type : String, 
		default: function(){
			return moment().format('MMMM Do YYYY, h:mm:ss a');
		} 
	},
	finishDateTime: {
		type : String, 
		default: function(){
			return null;
			
		} 
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
  registeredOwner: { 
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
    type: String,
	required: true,
	default: function(){return moment().format('MMMM Do YYYY');}
  },
  userName: {
  type: String,
  required: true
  },
  password: {
  type: String,
  required: true
  },
	admin: {
		type: Boolean,
		required: true,
		default: false
	}
});

//////////////////////////////////////////////////////////////
UserSchema.pre('save', function(next) {
    const user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, (err, salt)=> {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, (err, hash)=> {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function(passw, cb) {
    bcrypt.compare(passw, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};
//////////////////////////////////////////////////////////////


/*
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

UserSchema.methods.checkPassword = function (password) {
    return this.encryptPassword(password, this.salt) === this.hashedPassword;
};
*/

UserSchema.path('email').validate(function (email) {
   var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
   return emailRegex.test(email); 
}, 'The e-mail field cannot be empty.')

var User = mongoose.model('User', UserSchema);

module.exports = {
	Device: Device,
	User: User	
};