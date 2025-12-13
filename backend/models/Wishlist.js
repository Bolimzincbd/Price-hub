const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  phoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Phone', required: true },
  addedAt: { type: Date, default: Date.now }
});

// Ensure a user can't add the same phone twice
wishlistSchema.index({ userId: 1, phoneId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);