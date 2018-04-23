'use strict';
// Pubnub service configuration
// ===========================

var PubNub = require('pubnub');

var pubnub = new PubNub({
            publishKey : 'pub-c-f35a7620-53ed-4cfa-9e67-3417e8b93212',
            subscribeKey : 'sub-c-eaeee79c-46df-11e8-afae-2a65d00afee8',
            secretKey: "sec-c-NmYxM2FlMmEtZTk1MC00YzI3LTllMTEtMTViODFjZTNjMWVm",
            ssl: true
});



module.exports = {
  publish: function(channel, message){
    pubnub.publish({
             channel: channel,
             message: JSON.stringify(message)},
             function(status, response) {
               if (status.error) {
                 console.log(status)
               } else {
                 console.log("message Published w/ timetoken", response.timetoken)
               }
             });
  },
  subscribe: function(channel, callback){

    pubnub.addListener({

        message: function(m) {
            // handle message

            var msg = m.message; // The Payload

            callback(msg);
            }
  });
    // Subscribe to the demo_tutorial channel
    pubnub.subscribe({
        channels: [channel]
    });
  }
}