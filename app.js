require('dotenv').config();
const express = require('express');

const app = express();

// connect db
const connectDB = require('./db/connectDB')

const port = process.env.PORT || 4000;

// routers
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

// middleware
app.use(express.json());

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port , console.log(`Listening on port ${port}...`))
    console.log('MongoDB connected successsfully')  
  } catch (error) {
    console.log(error);
  }
};

start();