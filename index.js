import express from 'express';
import userRouter from './api/route/userRouter.js';
import deviceRouter from './api/route/deviceRouter.js';
import authenticateRouter from './api/route/authenticateRouter.js';
import bodyParser from 'body-parser';
import Model from './api/model/model.js';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import {loadUsers} from './api/model/userData';
import {loadDevices} from './api/model/deviceData';
import jwt from 'jsonwebtoken';
import {Mockgoose} from 'mockgoose';
import nodeEnv from 'node-env';
dotenv.config();


if (nodeEnv == 'test') {
  const mockgoose=new Mockgoose(mongoose);
  mockgoose.prepareStorage().then(()=>{
    mongoose.connect(process.env.mongoDB);
    if (process.env.seedDb) {
  loadUsers();
  loadDevices();
}
  });
} else {
    console.log('process.env.nodeEnv: '+nodeEnv );
  // use real deal for everything else
  mongoose.connect(process.env.mongoDB);
  if (process.env.seedDb) {
  loadUsers();
  loadDevices();
}
}

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error: '+ err);
    process.exit(-1);
});



const port = process.env.PORT;
export const server = express();
server.set('superSecret', process.env.jwtSecret);
userRouter.init(server);
//testUsersApi.init(server);
//authenticateRouter.init(server);
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

//server.use('/api/authenticate', authenticateRouter.router);
server.use('/api/user', userRouter.router);
server.use('/api/device', deviceRouter.router);

server.listen(port);
console.log(`Server running at ${port}`);
