// backend/models/Phone.js
const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: String, required: true },
  upcoming: { type: Boolean, default: false },
  latest: { type: Boolean, default: false },
  recommend: { type: Boolean, default: false },
  coverImage: String,
  price: { type: Number, required: true },
  year: Number,
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  specs: {
    display: String,
    processor: String,
    ram: String,
    storage: String,
    battery: String,
    camera: String,
  },
  reviews: [
    {
      user: String,
      rating: Number,
      comment: String,
    }
  ],
  stores: [
    {
      name: String,
      price: Number,
      url: String,
    }
  ]
});

module.exports = mongoose.model('Phone', phoneSchema);