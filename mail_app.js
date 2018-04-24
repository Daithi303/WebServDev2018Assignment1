var dotenv = require('dotenv');
dotenv.config();
var api_key = process.env.mailgun_api_key;
var domain = process.env.mailgun_domain;
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