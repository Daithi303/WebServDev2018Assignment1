import model from './model.js';

const devices = [
    {
	"deviceName": "device_27sgjwid",
	"minTempWarning": 2,
	"maxTempWarning": 18,
	"minutesToWaitBeforeSecondaryAlert": 5,
	"minutesAllowedForJourneyPause": 5
},
    {
	"deviceName": "device_18shwtd7",
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