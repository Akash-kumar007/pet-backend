const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const petMatingRoutes = require('./routes/petMating');
const path = require('path');
const PetTicket = require('./models/PetTicket');

dotenv.config();
// Initialize express app
const app = express();
const PORT = process.env.PORT || 5001;

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

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/petMatingDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

  // Mongoose Schema
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

// POST Route
app.post('/api/mating-requests', async (req, res) => {
    try {
        const newRequest = new MatingRequest(req.body);
        await newRequest.save();
        res.status(201).json({ message: 'Request submitted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//pet-mating-end


//pet friendlys cafs start

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/petcafe', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// POST: Book a table
app.post('/api/book', async (req, res) => {
  try {
    const { name, date, time, cafe, location } = req.body;
    const booking = new Booking({ name, date, time, cafe, location });
    await booking.save();
    res.json({ message: 'Booking confirmed successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Booking failed. Try again.' });
  }
});
//pet friendlys cafs start

//pet friendlys cafs end


//pet ticketing start

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/petservices', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));

// API endpoint
app.post('/api/pet-ticket', async (req, res) => {
  try {
    const newTicket = new PetTicket(req.body);
    await newTicket.save();
    res.json({ success: true, message: 'Booking saved!' });
  } catch (err) {
    console.error("MongoDB error:", err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
//pet ticketing end


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
