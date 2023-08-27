const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const path = require('path'); 
const contactsRouter = require('./routes/api/contacts'); 
const userRouter = require('./routes/api/user');
const authRoutes = require('./routes/api/authRoutes');
const verificationRoutes = require('./routes/api/verificationRoutes')
require('dotenv').config();
const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRoutes);
app.use('/api/users/verify', verificationRoutes);
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack); 
  res.status(500).json({ message: err.message });
});

module.exports = app;
