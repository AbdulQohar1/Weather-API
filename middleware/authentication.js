const jwt = require('jsonwebtoken');
// const {UnauthenticatedError} = require('../errors');

const auth = async (req, res, next) => {
// check header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Decoded payload:', payload);

    req.user = { 
      userId: payload.userId, 
      name: payload.name
    };
    next();
  } catch (error) {
    console.log("Authentication error: ", error);
    throw new UnauthenticatedError('Authentication invalid.');
    // res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
  };
};

module.exports = auth;
