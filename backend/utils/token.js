const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/env');

// Login token. `jwtid` lets us "log out" a single token later.
const createLoginToken = (user) =>
  jwt.sign({ id: user._id.toString(), role: user.role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
    jwtid: crypto.randomUUID(),
  });

const verifyLoginToken = (token) => jwt.verify(token, config.jwtSecret);

// We only store the hash of the reset token in the database.
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const createResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex'); // sent by email
  return {
    token,
    hashedToken: hashToken(token), // saved in the database
    expires: new Date(Date.now() + config.resetTokenMinutes * 60 * 1000),
  };
};

module.exports = { createLoginToken, verifyLoginToken, hashToken, createResetToken };
