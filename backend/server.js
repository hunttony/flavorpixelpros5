const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const validator = require('validator');
require('dotenv').config();

// Initialize Express app
const app = express();

// Apply CORS middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept'],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define Mongoose schema for contact form
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Please enter a valid email address',
    },
  },
  message: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => value.length <= 1000,
      message: 'Message cannot exceed 1000 characters',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create Mongoose model
const Contact = mongoose.model('Contact', contactSchema);

// Root endpoint for API
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Contact Form API' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running properly',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// POST /contact endpoint to save form data
app.post('/contact', async (req, res) => {
  console.log('Received POST request for /contact:', req.body);
  let { name, email, message } = req.body;

  // Sanitize inputs
  name = validator.escape(name).trim();
  email = validator.normalizeEmail(email.trim());
  message = validator.escape(message).trim();

  // Basic validation
  if (!name || !email || !message) {
    console.log('Validation failed: Missing fields');
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Create new contact document
    const newContact = new Contact({
      name,
      email,
      message,
    });

    // Save to MongoDB
    await newContact.save();
    console.log('Saved form data:', { name, email, message });

    // Respond with success
    res.status(200).json({ message: 'Message received and saved successfully' });
  } catch (error) {
    console.error('Error saving to MongoDB:', error);
    res.status(500).json({ error: 'Failed to save message. Please try again.' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;