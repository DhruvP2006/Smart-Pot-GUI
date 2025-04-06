const express = require('express');
const router = express.Router();
const cors = require('cors');
const {
  test,
  registerUser,
  loginUser,
  getProfile,
} = require('./../controllers/authController');

const allowedOrigins = [
  'https://smartpot-eta.vercel.app/', // your frontend
  'http://localhost:3000', // optional for local dev
];

router.use(cors({ credentials: true, origin: allowedOrigins }));

router.get('/', test);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getProfile);

module.exports = router;
