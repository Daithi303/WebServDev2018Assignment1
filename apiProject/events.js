'use strict';
// Pubnub service configuration
// ===========================
var dotenv = require('dotenv');
dotenv.config();
var PubNub = require('pubnub');
var publishKeyVal = process.env.publishKey;
var subscribeKeyVal = process.env.subscribeKey;
var secretKeyVal = process.env.secretKey;
var pubnub = new PubNub({
            publishKey : publishKeyVal,
            subscribeKey : subscribeKeyVal,
            secretKey: secretKeyVal,
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