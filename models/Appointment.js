// Mongoose package ko import karo
const mongoose = require("mongoose");

// Schema define karo (jo data tum MongoDB me save karna chahte ho)
const appointmentSchema = new mongoose.Schema({
  petName: { type: String, required: true },
  ownerName: { type: String, required: true },
  contact: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  service: { type: String, required: true },
  doctor: { type: String, default: "" }, // Optional field (default empty)
});

// Model banate hain schema se
const Appointment = mongoose.model("Appointment", appointmentSchema);

// Model export karte hain
module.exports = Appointment;
