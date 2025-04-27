const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// POST request to save appointment data in MongoDB
router.post("/", async (req, res) => {
  try {
    const { petName, ownerName, contact, date, time, service, doctor } = req.body;
    
    // Create a new Appointment record
    const newAppointment = new Appointment({
      petName,
      ownerName,
      contact,
      date,
      time,
      service,
      doctor,
    });

    // Save to the database
    await newAppointment.save();

    // Respond back to frontend
    res.status(201).json({ message: "Appointment booked successfully!" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
