const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Phone = require('./models/Phone');

dotenv.config();
const app = express();

app.use(cors());

// UPDATE THIS LINE: Increase limit to 10MB (or more) for images
app.use(express.json({ limit: '10mb' }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

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

// POST (CREATE)
app.post('/api/phones', async (req, res) => {
  try {
    const newPhone = new Phone(req.body);
    const savedPhone = await newPhone.save();
    res.json(savedPhone);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT (UPDATE)
app.put('/api/phones/:id', async (req, res) => {
  try {
    const updatedPhone = await Phone.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPhone);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
app.delete('/api/phones/:id', async (req, res) => {
  try {
    await Phone.findByIdAndDelete(req.params.id);
    res.json({ message: 'Phone deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));