import User from '../models/usersModel.js';
import bcrypt from 'bcryptjs';
import { accessToken, refreshToken } from '../utils/generateJWT.js';
import redisClient from '../database/redisDBConnect.js';

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const userData = { email, password };

  for (const key in userData) {
    if (!userData[key])
      return res.status(400).json({ message: `${key} is required` });
  }

  try {
    const existingUser = await User.findOne({ email: userData.email }).select(
      '+password'
    );
    if (!existingUser) {
      console.log(`User with email: ${userData.email} does not exists!`);
      return res.status(401).json({
        message: `User with email: ${userData.email} does not exists!`,
      });
    }

    const isMatch = await bcrypt.compare(
      userData.password,
      existingUser.password
    );
    if (!isMatch) {
      console.log(`Invalid Credentials`);
      return res.status(401).json({ message: `Invalid Credentials` });
    }

    // CREATE JWT AUTHENTICATION TOKEN
    // Check if token version exists in redis
    const tokenVersionKey = `tokenVersion:${existingUser.email}`;
    let tokenVersion = await redisClient.incr(tokenVersionKey);

    const access_token = accessToken(existingUser, tokenVersion);
    const refresh_token = refreshToken(existingUser, tokenVersion);

    // Save refresh token
    existingUser.refresh_token = refresh_token;
    await existingUser.save();

    res.cookie('JWT', refresh_token, {
      httpOnly: true,
      sameSite: 'Lax', // Change to "None" in production
      secure: process.env.NODE_ENV_MODE === 'prod',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Logged in successfully',
      accessToken: access_token,
      currentUser: existingUser,
    });
  } catch (error) {
    console.log(`An error occured while logging in user! ${error}`);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export default loginController;
