
const express = require('express');
const router = express.Router();
const User = require('../../models/user');

router.get('/:verificationToken', async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

user.verify = true;
user.verificationToken = null; 
await user.save();

    return res.status(200).json({ message: 'Email verification successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
