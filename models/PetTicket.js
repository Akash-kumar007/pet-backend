const mongoose = require('mongoose');

const PetTicketSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  from: String,
  to: String,
  date: String,
  travelMode: String,
  petDetails: String,
});

module.exports = mongoose.model('PetTicket', PetTicketSchema);
