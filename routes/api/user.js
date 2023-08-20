const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const multer = require('multer');
const path = require('path');
const jimp = require('jimp');
const fs = require('fs').promises;
const authMiddleware = require('../../middleware/authMiddleware');
const User = require('../../models/user');
const router = express.Router();
require('dotenv').config();

const tmpFolderPath = path.join(__dirname, '../../tmp')
const avatarsFolderPath = path.join(__dirname, '../../public/avatars')

const storage = multer.diskStorage({
    destination: tmpFolderPath,
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${path.extname(file.originalname)}`;
        cb (null, uniqueName)
    }
})

const upload = multer({ storage });

const authSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
router.patch('/avatars', authMiddleware, upload.single('avatar'), async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const uploadedImagePath = path.join(tmpFolderPath, req.file.filename);
        const processedImagePath = path.join(avatarsFolderPath, `${user._id}.jpg`);

        const image = await jimp.read(uploadedImagePath);
        await image.cover(250, 250).quality(90).writeAsync(processedImagePath);

        const avatarURL = `/avatars/${user._id}.jpg`;
        user.avatarURL = avatarURL;
        await user.save();
await fs.unlink(uploadedImagePath);
        return res.status(200).json({ avatarURL });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
router.post('/signup', async (req, res, next) => {
    try {
        const { error } = authSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
    return res.status(409).json({ message: 'Email in use' });
    }
        const hashedPassword = await bcrypt.hash(password, 10);
        const avatarURL = gravatar.url(email, { s: '200', r: 'pg', d: 'identicon' });
    
    const newUser = await User.create({
    email,
        password: hashedPassword,
    avatarURL,
    });
    
    return res.status(201).json({ user: { email: newUser.email, subscription: newUser.subscription, avatarURL: newUser.avatarURL } });
} catch (error) {
    return res.status(500).json({ message: 'Server error' });
}
});
 
router.post('/login', async (req, res, next) => {
    try {
        const { error } = authSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: "Provide email and password" });
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Email or password is wrong' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email or password is wrong' });
        }
const secretKey = process.env.JWT_SECRET_KEY;

const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
        user.token = token;
        await user.save();
        return res.status(200).json({
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
router.get('/protected', authMiddleware, async (req, res) => {
try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
    return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({
    user: {
        email: user.email,
        subscription: user.subscription,
    },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});
router.post('/logout', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found'})
        }
        user.token = null;
        await user.save();
        return res.status(200).json({ message: 'Logout successful'});
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
})
router.get('/current', authMiddleware, async (req, res) => {
    try {
        const user = req.user;

        return res.status(200).json({
            email: user.email,
            subscription: user.subscription
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router