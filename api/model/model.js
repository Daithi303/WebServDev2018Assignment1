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
		type: String, 
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
		required: true,
		unique: true
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
  type: String,
  },
	journey: [JourneySchema]
});

var Device =  mongoose.model('Device', DeviceSchema);

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
  required: true,
  unique: true
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