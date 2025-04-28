const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const deliverySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {  // updated from 'gmail'
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  streetAddress: {
    type: String,
    required: false,
  },
  postalCode: {
    type: String,
    required: true,
  },
  deliveryTimeSlot: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Pending", // Optional: default value
  },
  formattedLocation: {
    type: String,
    required: false,
  }
});

module.exports = mongoose.model("Delivery", deliverySchema);
