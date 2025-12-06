// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Phone = require('./models/Phone');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// --- API ROUTES ---

// 1. GET ALL Phones (with optional filtering)
app.get('/api/phones', async (req, res) => {
  try {
    const phones = await Phone.find();
    res.json(phones);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. GET SINGLE Phone by ID
app.get('/api/phones/:id', async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id);
    if (!phone) return res.status(404).json({ message: 'Phone not found' });
    res.json(phone);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. CREATE a new Phone
app.post('/api/phones', async (req, res) => {
  const phone = new Phone(req.body);
  try {
    const newPhone = await phone.save();
    res.status(201).json(newPhone);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. UPDATE a Phone
app.put('/api/phones/:id', async (req, res) => {
  try {
    const updatedPhone = await Phone.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPhone);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 5. DELETE a Phone
app.delete('/api/phones/:id', async (req, res) => {
  try {
    await Phone.findByIdAndDelete(req.params.id);
    res.json({ message: 'Phone deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});