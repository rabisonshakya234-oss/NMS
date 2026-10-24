// Loads the .env file and exposes all settings in one place.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });

const env = process.env;

const config = {
  isProduction: env.NODE_ENV === 'production',
  mongoUri: env.MONGODB_URI,
  jwtSecret: env.Auth_SecretKey,
  jwtExpiresIn: env.JWT_EXPIRES_IN || '1d',
  saltRounds: Number(env.BCRYPT_SALT_ROUNDS) || 10,
  clientUrl: (env.CLIENT_URL || 'http://localhost:3000').replace(/\/+$/, ''),
  // The reset email links to <resetPageUrl>/<token>. Default: the built-in web app.
  resetPageUrl: (env.RESET_PAGE_URL || `${(env.CLIENT_URL || 'https://nms-10.onrender.com').replace(/\/+$/, '')}/app/#/reset`).replace(/\/+$/, ''),
  resetTokenMinutes: Number(env.RESET_TOKEN_EXPIRES_MINUTES) || 15,

  // nodemailer (SMTP) settings
  mail: {
    host: env.EMAIL_HOST,
    port: Number(env.EMAIL_PORT) || 587,
    secure: env.EMAIL_SECURE === 'true',
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
    from: env.EMAIL_FROM || env.EMAIL_USER || 'Note Management <no-reply@localhost>',
  },

  // Free Gemini API key from https://aistudio.google.com/apikey
  gemini: {
    apiKey: env.GEMINI_API_KEY,
    model: env.GEMINI_MODEL || 'gemini-2.5-flash',
    requestsPerMinute: Number(env.AI_REQUESTS_PER_MINUTE) || 5, // per user (free tier limits are low)
  },
};

if (!config.mongoUri || !config.jwtSecret) {
  throw new Error('MONGODB_URI and Auth_SecretKey must be set in the .env file');
}

module.exports = config;
