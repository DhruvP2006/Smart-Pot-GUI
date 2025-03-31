const User = require('./../models/usersModel');

const test = (req, res) => {
  res.json('test is working');
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name) {
      return res.json({
        error: 'Name is required',
      });
    }
    if (!password || password.length < 6) {
      return res.json({
        error: 'Password is required and should be atleast 6 Characters Long',
      });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({
        error: 'Email is taken already',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });
    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { test, registerUser };
