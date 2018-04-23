var api_key = 'key-603755c58f8aa2b34c5cdfc79d1e3c0f';
var domain = 'sandbox2bc537205c04440faec60f5093a3cc5b.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var userEvent = require('./events');

var  messageHandler = function(m) {
         // The Payload
        var data = {
            'from': 'WIT BSc IT <me@wit.ie>',
            'to': '20066109@mail.wit.ie',
            'subject': 'User Created',
            'text': 'A user has just been creted'
          };

          mailgun.messages().send(data, function (error, body) {
            console.log(body);
          });
        }

userEvent.subscribe('create_user_event', messageHandler)