const jwt = require('jsonwebtoken');
const User = require('../models/user'); 

module.exports = async (req, res, next) => {
try {
    const token = req.headers.authorization.split(' ')[1]; 
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decodedToken.userId);
    if (!user) {
    return res.status(401).json({ message: 'Not authorized' });
    }

    req.user = {
    userId: user._id,
    email: user.email,
    subscription: user.subscription,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized' });
  }
};