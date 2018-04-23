'use strict';
// Pubnub service configuration
// ===========================

var PubNub = require('pubnub');

var pubnub = new PubNub({
            publishKey : 'pub-c-55a81b4c-261d-4528-bb9c-64230b45ec46',
            subscribeKey : 'sub-c-ac3c93a2-4737-11e8-b5d4-4e74274099a3',
            secretKey: "sec-c-NWFiOGI5NjUtOWM0Ny00ZjQwLWExYzItM2ZjNjgwODE4MjFl",
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