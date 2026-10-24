const express = require('express');
const cors = require('cors');
const config = require('../config/env');
const { notFound } = require('../utils/errorHandler');

const router = express.Router();

const allowedOrigins = [
  config.clientUrl,
  'https://nms-99e8.vercel.app',
  'http://localhost:3000',
];

router.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(null, false);
  },
}));

router.get('/health', (req, res) => res.json({ success: true, message: 'OK' }));

router.use('/auth', require('./authRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/notes', require('./noteRoutes'));
router.use('/reminders', require('./reminderRoutes'));
router.use('/ai', require('./aiRoutes'));

router.use(notFound);

module.exports = router;
