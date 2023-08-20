const loginController = require('./logincontroller');
const jwt = require('jsonwebtoken'); 
const User = require('../models/user'); 

jest.mock('jsonwebtoken');
jest.mock('../models/user');

describe('Login Controller', () => {
  it('should successfully log in a user and return a token and user object', async () => {
    const mockUser = {
      _id: 'user-id',
      email: 'example@example.com',
      subscription: 'starter',
    };
    const mockToken = 'mock-token';
    const expectedResponse = {
      token: mockToken,
      user: {
        email: mockUser.email,
        subscription: mockUser.subscription,
      },
    };
    User.findOne.mockResolvedValue(mockUser);

    jwt.sign.mockReturnValue(mockToken);

    const req = {
      body: {
        email: 'example@example.com',
        password: 'password',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await loginController(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });
});
