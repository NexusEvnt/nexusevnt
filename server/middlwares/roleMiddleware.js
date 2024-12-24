import User from '../models/userModel.js';

export const roleMiddleware = (roles) => {
  const verifyRole = async (req, res, next) => {
    // Check if the user is authenticated
    const user = await User.findOne({ email: userData.email });
    if (!user) {
      console.log(`User with email: ${userData.email} does not exists!`);
      return res.status(400).json({
        message: `User with email: ${userData.email} does not exists!`,
      });
    }
    // Gets the user role from the user object
    const userRole = req.user.role;

    // Check if the user role is in the roles array
    if (!roles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: 'Access denied: insufficient permissions' });
    }

    // Else, the user has the required role and can proceed to the next middleware
    next();
  };

  return verifyRole;
};
