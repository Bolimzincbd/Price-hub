// backend/models/Blog.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true }, // Short summary for the card
  content: { type: String, required: true }, // Full article content
  category: { type: String, default: "Technology" },
  image: { type: String }, // URL or Base64 string
  author: { type: String, default: "Admin" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);