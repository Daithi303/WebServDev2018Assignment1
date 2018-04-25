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

dotenv.config();
mongoose.connect(process.env.mongoDB);

if (process.env.seedDb) {
  loadUsers();
  loadDevices();
}

const port = process.env.PORT;
export const server = express();
server.set('superSecret', process.env.jwtSecret);
//userRouter.init(server);
//deviceRouter.init(server);
//authenticateRouter.init(server);
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use('/api/authenticate', authenticateRouter.router);
server.use('/api/user', userRouter.router);
server.use('/api/device', deviceRouter.router);

server.listen(port);
console.log(`Server running at ${port}`);