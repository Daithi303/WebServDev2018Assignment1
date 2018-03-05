import express from 'express';
import userRouter from './api/route/userRouter.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import {loadUsers} from './api/model/userData';
dotenv.config();
mongoose.connect(process.env.mongoDB);
// Populate DB with sample data
if (process.env.seedDb) {
  loadUsers();
}
const port = process.env.PORT;

const server = express();
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use('/api/user', userRouter);
//server.use(express.static('public'));

server.listen(port);
// Put a friendly message on the terminal
console.log(`Server running at ${port}`);