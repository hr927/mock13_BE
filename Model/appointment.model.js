const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema({
  name: String,
  image: String,
  specialization: String,
  experience: Number,
  location: String,
  date: String,
  slots: Number,
  fee: Number,
});

const AppointmentModel = mongoose.model("appointment", appointmentSchema);

module.exports = { AppointmentModel };
