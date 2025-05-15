const mongoose = require('mongoose');

const petMatingSchema = new mongoose.Schema({
  petName: { type: String, required: true },
  petType: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  location: { type: String, required: true },
  ownerContact: { type: String, required: true },
  image: { type: String, required: true },
}, { timestamps: true });

const PetMating = mongoose.model('PetMating', petMatingSchema);

module.exports = PetMating;
