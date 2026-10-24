const express = require('express');
const cors = require('cors');
const config = require('../config/env');
const { notFound } = require('../utils/errorHandler');

const router = express.Router();

router.use(cors({ origin: config.clientUrl })); // lets your frontend call this API

router.get('/health', (req, res) => res.json({ success: true, message: 'OK' }));

router.use('/auth', require('./authRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/notes', require('./noteRoutes'));
router.use('/reminders', require('./reminderRoutes'));
router.use('/ai', require('./aiRoutes'));

router.use(notFound);

module.exports = router;
