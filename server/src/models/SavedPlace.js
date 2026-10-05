const mongoose = require('mongoose');

const savedPlaceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    placeId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      lat: Number,
      lng: Number,
      address: String,
    },
    type: {
      type: String,
      enum: ['attraction', 'restaurant', 'hotel', 'other'],
      default: 'attraction',
    },
    rating: Number,
    imageUrl: String,
    notes: String,
  },
  { timestamps: true }
);

savedPlaceSchema.index({ userId: 1 });
savedPlaceSchema.index({ userId: 1, placeId: 1 }, { unique: true });

module.exports = mongoose.model('SavedPlace', savedPlaceSchema);
