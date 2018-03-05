import mongoose from 'mongoose';
const Schema = mongoose.Schema;

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
    type: Date,
	required: true,
	default: Date.now
  },
  userName: {
  type: String,
  required: true
  },
  password: {
  type: String,
  required: true
  },
  registeredDevices: [{ type: Schema.Types.ObjectId, ref: 'Device' }]
});

var User = mongoose.model('User', UserSchema);

module.exports = {
	Device: Device,
	User: User	
};