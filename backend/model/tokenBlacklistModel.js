const mongoose = require("mongoose");

const tokenBlacklistSchema = new mongoose.Schema({
  jti: { type: String, required: true, unique: true }, // id of the logged-out token
  expiresAt: { type: Date, required: true },
});

// MongoDB removes the document automatically once expiresAt has passed.
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema);
module.exports = TokenBlacklist;