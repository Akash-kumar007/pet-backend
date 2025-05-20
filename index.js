const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MongoDB once
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/petservice', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));


// ✅ Define all schemas & models here (using single DB)

// 1. Appointment Schema
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

// 2. Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// 3. Grooming Booking Schema
const groomingBookingSchema = new mongoose.Schema({
  ownerName: String,
  petName: String,
  petType: String,
  service: String,
  date: String,
  time: String,
});
const GroomingBooking = mongoose.model('GroomingBooking', groomingBookingSchema);

// 4. Mating Request Schema
const matingSchema = new mongoose.Schema({
  ownerName: String,
  contact: String,
  petName: String,
  petType: String,
  breed: String,
  gender: String,
  age: Number,
  location: String,
  description: String,
}, { timestamps: true });
const MatingRequest = mongoose.model('MatingRequest', matingSchema);

// 5. Pet Café Booking Schema
const cafeBookingSchema = new mongoose.Schema({
  name: String,
  date: String,
  time: String,
  cafe: String,
  location: String,
});
const CafeBooking = mongoose.model('CafeBooking', cafeBookingSchema);

// 6. Pet Ticket Schema
const petTicketSchema = new mongoose.Schema({
  petName: String,
  ownerName: String,
  travelDate: String,
  destination: String,
  seatType: String,
  specialNeeds: String,
});
const PetTicket = mongoose.model('PetTicket', petTicketSchema);


// ✅ Routes

// Appointment Route
app.post('/api/appointment', async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    res.status(201).json({ message: 'Appointment saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving appointment', error: err.message });
  }
});

// Contact Route
app.post('/api/contact', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(200).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});

// Grooming Booking
app.post('/api/book-groom-appointment', async (req, res) => {
  try {
    const newBooking = new GroomingBooking(req.body);
    await newBooking.save();
    res.status(200).json({ message: 'Booking submitted successfully!', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error while submitting booking', error });
  }
});

// Pet Mating Request
app.post('/api/mating-requests', async (req, res) => {
  try {
    const newRequest = new MatingRequest(req.body);
    await newRequest.save();
    res.status(201).json({ message: 'Request submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pet Café Booking
app.post('/api/book-cafe', async (req, res) => {
  try {
    const newCafeBooking = new CafeBooking(req.body);
    await newCafeBooking.save();
    res.json({ message: 'Cafe booking confirmed successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Booking failed. Try again.' });
  }
});

// Pet Ticketing
app.post('/api/pet-ticket', async (req, res) => {
  try {
    const newTicket = new PetTicket(req.body);
    await newTicket.save();
    res.json({ success: true, message: 'Booking saved!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


// ✅ Start server with error handling
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error('Server error:', err);
  }
});
