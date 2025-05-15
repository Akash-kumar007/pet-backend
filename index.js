const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const petMatingRoutes = require('./routes/petMating');
const path = require('path');
const authRoutes = require('./routes/auth');

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


//Book a Grooming Appointment start
// Define the Schema and Model
const bookingSchema = new mongoose.Schema({
  ownerName: String,
  petName: String,
  petType: String,
  service: String,
  date: String,
  time: String,
});

const Booking = mongoose.model('Book-grooming', bookingSchema);

// POST Route to Save the Booking
app.post('/api/book-groom-appointment', async (req, res) => {
  try {
    const { ownerName, petName, petType, service, date, time } = req.body;

    // Create a new booking document
    const newBooking = new Booking({
      ownerName,
      petName,
      petType,
      service,
      date,
      time,
    });

    // Save to MongoDB
    await newBooking.save();

    res.status(200).json({ message: 'Booking submitted successfully!', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error while submitting booking', error });
  }
});
//Book a Grooming Appointment end



//pet-mating start

// Environment variables
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', petMatingRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.log('MongoDB connection error:', err);
  });
//pet-mating-end


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
