const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();
// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Use middleware
app.use(cors());
app.use(bodyParser.json()); // This will allow us to parse incoming JSON data
dotenv.config();

// MongoDB Connection (using the URI from environment variables or fallback to localhost)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Pet-service')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


// Define the Appointment Schema
const appointmentSchema = new mongoose.Schema({
  petName: String,
  ownerName: String,
  contact: String,
  date: String,
  time: String,
  service: String,
  doctor: String,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Route to save appointment data
app.post('/api/appointment', async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    res.status(201).json({ message: 'Appointment saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving appointment', error: err.message });
  }
});

// Create Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create Contact Model
const Contact = mongoose.model('Contact', contactSchema);

// API Route
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Save contact data
    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

    res.status(200).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error saving contact data:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});

// In-memory booking data (can be replaced with MongoDB)
const bookings = [];

// POST endpoint for booking
app.post('/api/book', (req, res) => {
  const booking = req.body;
  console.log("Received booking:", booking);

  bookings.push(booking); // Save to in-memory array
  res.status(200).json({ message: 'Booking successful!', data: booking });
});

// Optional: check all bookings
app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
