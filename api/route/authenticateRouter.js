import express from 'express';
import Model from './../model/model.js';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
const router = express.Router(); 
//var server = null;

import {server} from './../../index.js';

/*
function init(serverIn) {
  server = serverIn;
};

*/
router.post('/', (req, res) => {
Model.User.findOne({
    userName: req.body.userName
  }, function(err, user) {
    if (err) return handleError(res, err)
    if (!user) {
      return res.status(404).json({ success: false, message: 'Authentication failed. User not found.' });
    } else{
		var passwordIsRight = user.checkPassword(req.body.password);
      if (passwordIsRight == false) {
        return res.status(404).json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
    const payload = {
      admin: user.admin 
    };
        var token = jwt.sign(payload, server.get('superSecret'), {
          expiresIn: 60*60*24
        });
var superSecret = server.get('superSecret');
        return res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   
    }
  });
});

function handleError(res, err) {
  return res.send(500, err);
};

module.exports = {
	router: router
	//,
	//init: init	
};