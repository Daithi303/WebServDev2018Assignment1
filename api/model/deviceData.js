import model from './model.js';

const devices = [
    {
	"deviceName": "device0001",
	"minTempWarning": 2,
	"maxTempWarning": 18,
	"minutesToWaitBeforeSecondaryAlert": 5,
	"minutesAllowedForJourneyPause": 5,
	"registeredOwner":"danny101",
	    "journey": [
        {
            "journeyState": "inProgress",
            "startDateTime": "journey0001startDateTime",
            "finishDateTime": null,
            "initiator": "danny101",
            "_id": "5ae2ff223d6b3c0e612260e2"
        },
                {
            "journeyState": "inProgress",
            "startDateTime": "journey0002startDateTime",
            "finishDateTime": null,
            "initiator": "danny101",
            "_id": "5ae7ff223d2b3c3e612260e6"
        }
    ]
},
    {
	"deviceName": "device0002",
	"minTempWarning": 2,
	"maxTempWarning": 18,
	"minutesToWaitBeforeSecondaryAlert": 5,
	"minutesAllowedForJourneyPause": 5
}
];

export const loadDevices = () => {
  model.Device.find({}).remove(() => {
    model.Device.collection.insert(devices, (err, docs)=>{
    if (err) {
      console.log(`failed to load device data: ${err}`);
    } else {
      console.info(`${devices.length} devices were successfully stored.`);
    }
  });
});
};