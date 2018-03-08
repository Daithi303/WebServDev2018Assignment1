import express from 'express';
import userRouter from './api/route/userRouter.js';
import deviceRouter from './api/route/deviceRouter.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import {loadUsers} from './api/model/userData';
import {loadDevices} from './api/model/deviceData';
dotenv.config();
mongoose.connect(process.env.mongoDB);
// Populate DB with sample data
if (process.env.seedDb) {
  loadUsers();
  loadDevices();
}
const port = process.env.PORT;

const server = express();
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use('/api/user', userRouter);
server.use('/api/device', deviceRouter);
//server.use(express.static('public'));

server.listen(port);
// Put a friendly message on the terminal
console.log(`Server running at ${port}`);