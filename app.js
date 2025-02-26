const express = require('express');

const app = express();

// connect db
const connectDB = require('./db/connectDB')

const port = process.env.PORT || 4000;

// routes
app.use(express.json());

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