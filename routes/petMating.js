const express = require('express');
const multer = require('multer');
const PetMating = require('../models/PetMating');
const path = require('path');
const router = express.Router();

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route to handle pet mating form submission
router.post('/pet-mating', upload.single('image'), async (req, res) => {
  try {
    const { petName, petType, breed, age, gender, location, ownerContact } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newPetMating = new PetMating({
      petName,
      petType,
      breed,
      age,
      gender,
      location,
      ownerContact,
      image,
    });

    await newPetMating.save();
    res.status(200).json({ message: 'Pet mating request submitted successfully', data: newPetMating });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to submit pet mating request', error });
  }
});

module.exports = router;
