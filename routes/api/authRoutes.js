const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const User = require('../../models/user');
const transporter = require('../../config/nodemailer');

router.post('/signup', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already in use' });
    }

    const user = new User({
      email,
      password,
    });

    const verificationToken = uuid.v4();
    user.verificationToken = verificationToken;

    await user.save();

    const verificationLink = `${process.env.BASE_URL}/api/users/verify/${verificationToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Email Verification',
      text: `Click this link to verify your email: ${verificationLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending verification email' });
      }

      res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
