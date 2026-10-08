const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: String,
  startTime: String,
  duration: String,
  description: String,
  location: {
    lat: Number,
    lng: Number,
    address: String,
  },
  type: { type: String, enum: ['attraction', 'restaurant', 'hotel', 'transport', 'other'] },
  rating: Number,
  estimatedCost: Number,
  imageUrl: String,
  placeId: String,
});

const accommodationSchema = new mongoose.Schema({
  name: String,
  type: String,
  location: String,
  estimatedCost: Number,
  rating: Number,
}, { _id: false });

const daySchema = new mongoose.Schema({
  day: Number,
  date: String,
  title: String,
  theme: String,
  weather: {
    condition: String,
    temperature: Number,
    humidity: Number,
    description: String,
  },
  activities: [activitySchema],
  meals: {
    breakfast: {
      name: String,
      location: String,
      estimatedCost: Number,
    },
    lunch: {
      name: String,
      location: String,
      estimatedCost: Number,
    },
    dinner: {
      name: String,
      location: String,
      estimatedCost: Number,
    },
  },
  accommodation: accommodationSchema,
  estimatedCost: Number,
  tips: [String],
});

const budgetBreakdownSchema = new mongoose.Schema({
  transportation: Number,
  accommodation: Number,
  food: Number,
  activities: Number,
  miscellaneous: Number,
  total: Number,
});

const transportDetailsSchema = new mongoose.Schema(
  {
    vehicleType: { type: String, enum: ['car', 'bike', 'bus', 'train', 'flight', 'rental car', 'other'], default: 'car' },
    fuelType: { type: String, enum: ['petrol', 'diesel', 'n/a'], default: 'petrol' },
    mileage: { type: Number, default: 15 },
    oneWayDistanceKm: { type: Number, default: 0 },
    roundTripDistanceKm: { type: Number, default: 0 },
    fuelRequiredLiters: { type: Number, default: 0 },
    fuelPricePerLiter: { type: Number, default: 104 },
    calculatedFuelCost: { type: Number, default: 0 },
  },
  { _id: false }
);

const selectedHotelSchema = new mongoose.Schema(
  {
    placeId: String,
    name: String,
    rating: Number,
    address: String,
    location: {
      lat: Number,
      lng: Number,
    },
    pricePerNight: Number,
    isEstimatedPrice: { type: Boolean, default: true },
    imageUrl: String,
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    startLocation: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    travelers: {
      adults: { type: Number, default: 1 },
      children: { type: Number, default: 0 },
    },
    budget: {
      type: Number,
      required: true,
    },
    preferences: {
      travelStyle: [String],
      transport: [String],
      accommodation: String,
      interests: [String],
    },
    transportDetails: transportDetailsSchema,
    selectedHotel: selectedHotelSchema,
    summary: String,
    estimatedCost: Number,
    budgetBreakdown: budgetBreakdownSchema,
    budgetStatus: {
      type: String,
      enum: ['within', 'over', 'unknown'],
      default: 'unknown',
    },
    itinerary: [daySchema],
    status: {
      type: String,
      enum: ['draft', 'generated', 'saved', 'shared'],
      default: 'draft',
    },
    shareId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isShared: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    coverImage: String,
  },
  { timestamps: true }
);

// Index for fast queries
tripSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Trip', tripSchema);
