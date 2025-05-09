const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DriveSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  gmail: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'away'],
    default: 'available'
  }
});

module.exports = mongoose.model("Drive", DriveSchema);