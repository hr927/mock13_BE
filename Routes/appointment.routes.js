const express = require("express");
const { authenticate } = require("../Middleware/authenticate.middleware");
const { AppointmentModel } = require("../Model/appointment.model");

const appointmentRouter = express.Router();

appointmentRouter.post("/create", async (req, res) => {
  const {
    name,
    image,
    specialization,
    experience,
    location,
    date,
    slots,
    fee,
  } = req.body;
  try {
    if (
      name === "" ||
      image === "" ||
      specialization === "" ||
      experience === "" ||
      location === "" ||
      date === "" ||
      slots === "" ||
      fee === ""
    ) {
      res.send({ msg: "Please Enter all the details" });
    } else {
      const appointment = new AppointmentModel({
        name,
        image,
        specialization,
        experience,
        location,
        date,
        slots,
        fee,
      });
      await appointment.save();
      res.send({ msg: "New Appointment Created" });
    }
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err.message });
  }
});

appointmentRouter.get("/appointments", async (req, res) => {
  const query = req.query;
  const limit = 4;
  const page = parseInt(query.page) || 1;
  const sorting = query.sorting === "desc" ? -1 : 1;
  try {
    if (query.spec && !query.search) {
      const appointments = await AppointmentModel.find({
        specialization: query.spec,
      })
        .sort({ date: sorting })
        .skip((page - 1) * limit)
        .limit(limit);
      res.send(appointments);
    } else if (query.search && !query.spec) {
      const appointments = await AppointmentModel.find({
        name: { $regex: `(?i)${query.search}(?-i)` },
      })
        .sort({ date: sorting })
        .skip((page - 1) * limit)
        .limit(limit);
      res.send(appointments);
    } else if (query.spec && query.search) {
      const appointments = await AppointmentModel.find({
        $and: [
          { specialization: query.spec },
          {
            name: { $regex: `(?i)${query.search}(?-i)` },
          },
        ],
      })
        .sort({ date: sorting })
        .skip((page - 1) * limit)
        .limit(limit);
      res.send(appointments);
    } else {
      const appointments = await AppointmentModel.find()
        .sort({ date: sorting })
        .skip((page - 1) * limit)
        .limit(limit);
      res.send(appointments);
    }
  } catch (error) {
    res.send({ msg: "Something went wrong", error: err.message });
  }
});

appointmentRouter.patch("/book/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  try {
    await AppointmentModel.findByIdAndUpdate({ _id: id }, payload);
    res.send({ msg: "Booking Done" });
  } catch (error) {
    res.send({ msg: "Something went wrong", error: err.message });
  }
});

module.exports = { appointmentRouter };
