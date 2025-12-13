const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Phone = require('./models/Phone');
const Wishlist = require('./models/Wishlist'); // Import Wishlist

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// --- EXISTING ROUTES (GET/POST/PUT/DELETE Phones) ---
app.get('/api/phones', async (req, res) => {
  try {
    const phones = await Phone.find();
    res.json(phones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/phones/:id', async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id);
    if (!phone) return res.status(404).json({ msg: 'Phone not found' });
    res.json(phone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/phones', async (req, res) => {
  try {
    const newPhone = new Phone(req.body);
    const savedPhone = await newPhone.save();
    res.json(savedPhone);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/phones/:id', async (req, res) => {
  try {
    const updatedPhone = await Phone.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPhone);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/phones/:id', async (req, res) => {
  try {
    await Phone.findByIdAndDelete(req.params.id);
    res.json({ message: 'Phone deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- NEW ROUTES ---

// 1. ADD REVIEW
app.post('/api/phones/:id/reviews', async (req, res) => {
  const { user, rating, comment } = req.body;
  try {
    const phone = await Phone.findById(req.params.id);
    if (!phone) return res.status(404).json({ msg: 'Phone not found' });

    const newReview = { user, rating: Number(rating), comment };
    phone.reviews.push(newReview);

    // Update aggregate rating
    const totalRating = phone.reviews.reduce((acc, curr) => acc + curr.rating, 0);
    phone.rating = (totalRating / phone.reviews.length).toFixed(1);
    phone.reviewCount = phone.reviews.length;

    await phone.save();
    res.json(phone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. WISHLIST ROUTES
// Get user wishlist
app.get('/api/wishlist/:userId', async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.params.userId }).populate('phoneId');
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add to wishlist
app.post('/api/wishlist', async (req, res) => {
  const { userId, phoneId } = req.body;
  try {
    const existing = await Wishlist.findOne({ userId, phoneId });
    if (existing) return res.status(400).json({ msg: 'Already in wishlist' });

    const newItem = new Wishlist({ userId, phoneId });
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove from wishlist
app.delete('/api/wishlist/:userId/:phoneId', async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ userId: req.params.userId, phoneId: req.params.phoneId });
    res.json({ msg: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));