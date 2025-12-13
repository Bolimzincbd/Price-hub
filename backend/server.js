// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Phone = require('./models/Phone');
const Wishlist = require('./models/Wishlist'); 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// --- PHONE ROUTES ---

// GET ALL
app.get('/api/phones', async (req, res) => {
  try {
    const phones = await Phone.find();
    res.json(phones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ONE
app.get('/api/phones/:id', async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id);
    if (!phone) return res.status(404).json({ msg: 'Phone not found' });
    res.json(phone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE PHONE
app.post('/api/phones', async (req, res) => {
  try {
    const newPhone = new Phone(req.body);
    const savedPhone = await newPhone.save();
    res.json(savedPhone);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE PHONE
app.put('/api/phones/:id', async (req, res) => {
  try {
    const updatedPhone = await Phone.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPhone);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE PHONE
app.delete('/api/phones/:id', async (req, res) => {
  try {
    await Phone.findByIdAndDelete(req.params.id);
    res.json({ message: 'Phone deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- REVIEW ROUTE ---
app.post('/api/phones/:id/reviews', async (req, res) => {
  const { user, rating, comment } = req.body;
  
  if (!user || !rating || !comment) {
    return res.status(400).json({ msg: "Please provide user, rating, and comment" });
  }

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
    res.json(phone); // Return updated phone object
  } catch (err) {
    console.error("Review Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- WISHLIST ROUTES ---

// Get user wishlist
app.get('/api/wishlist/:userId', async (req, res) => {
  try {
    // Populate phone details so we can display them
    const wishlist = await Wishlist.find({ userId: req.params.userId })
      .populate('phoneId')
      .sort({ addedAt: -1 });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add to wishlist
app.post('/api/wishlist', async (req, res) => {
  const { userId, phoneId } = req.body;
  
  if (!userId || !phoneId) {
    return res.status(400).json({ msg: "Missing userId or phoneId" });
  }

  try {
    // Check if already exists
    const existing = await Wishlist.findOne({ userId, phoneId });
    if (existing) {
        // Return 200 OK if it already exists, so frontend considers it "success"
        return res.status(200).json({ msg: 'Already in wishlist', item: existing });
    }

    const newItem = new Wishlist({ userId, phoneId });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Remove from wishlist (By User ID + Phone ID) - Used by Phone Cards
app.delete('/api/wishlist/:userId/:phoneId', async (req, res) => {
  try {
    const result = await Wishlist.findOneAndDelete({ 
        userId: req.params.userId, 
        phoneId: req.params.phoneId 
    });
    
    if (!result) {
        return res.status(404).json({ msg: 'Item not found in wishlist' });
    }
    
    res.json({ msg: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove from wishlist (By Wishlist Item ID) - Used by Dashboard
app.delete('/api/wishlist/item/:id', async (req, res) => {
    try {
        const result = await Wishlist.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ msg: 'Wishlist item not found' });
        }
        res.json({ msg: 'Removed from wishlist' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));