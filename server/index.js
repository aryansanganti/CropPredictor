const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// Define schema
const CropSchema = new mongoose.Schema({
  N: Number,
  P: Number,
  K: Number,
  temperature: Number,
  humidity: Number,
  ph: Number,
  rainfall: Number,
  predicted_crop: String,
  created_at: { type: Date, default: Date.now }
});
const Crop = mongoose.model('Crop', CropSchema);

// Save prediction
app.post('/save', async (req, res) => {
  try {
    const newCrop = new Crop(req.body);
    await newCrop.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get prediction history
app.get('/history', async (req, res) => {
  const history = await Crop.find().sort({ created_at: -1 });
  res.json(history);
});

app.listen(5001, () => console.log('Server running at http://localhost:5001'));
