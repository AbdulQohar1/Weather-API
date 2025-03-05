const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name for this location'],
    maxLength: 100,
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    }
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// create geospatial index for faster quieries
LocationSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Location', LocationSchema);