const User = require('./../models/usersModel');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');

// Test Route
const test = (req, res) => {
  res.status(200).json('test is working');
};

// Register Endpoint
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        error: 'Password is required and should be at least 6 characters long',
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error. Couldn't register user." });
  }
};

// Login Endpoint
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'No user found with this email' });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    jwt.sign(
      { email: user.email, id: user._id, name: user.name },
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to create token' });
        }

        res
          .cookie('token', token, {
            httpOnly: true,
            sameSite: 'Lax',
            secure: process.env.NODE_ENV === 'production',
          })
          .status(200)
          .json(user);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

const getProfile = (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) throw err;
      res.json(user);
    });
  } else {
    res.json(null);
  }
};

module.exports = { test, registerUser, loginUser, getProfile };
