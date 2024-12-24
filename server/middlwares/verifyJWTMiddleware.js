import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const verifyJWT = (req, res, next) => {
  // Gets the token from the header
  const authHeader = req.headers['authorization'];
  console.log(authHeader); // Bearer <token>
  if (!authHeader)
    return res
      .status(401)
      .json({ message: 'Unauthorized Access: TOKEN required!' });
  const access_token = authHeader.split(' ')[1];

  // Verify the token (Might switch to try catch block)
  jwt.verify(
    access_token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Invalid Token' });
      const user = await User.findOne({ email: decoded.email });

      // If user is not found in the database return 404
      if (!user) return res.status(404).json({ message: 'User not found' });

      // If user is found, attach the user to the request object and call the next middleware
      req.user = user;
      next();
    }
  );
};

export default verifyJWT;
