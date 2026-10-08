const Trip = require('../models/Trip');
const { planTrip, replanTrip } = require('../services/itineraryService');
const { searchHotels, calculateRouteDistance } = require('../services/mapsService');
const { validateTripInput } = require('../utils/validators');
const crypto = require('crypto');
const logger = require('../utils/logger');

// @desc    Get real hotels for a destination
// @route   GET /api/trips/hotels
// @access  Private
const getHotels = async (req, res, next) => {
  try {
    const { destination, minRating, maxPrice } = req.query;
    if (!destination) {
      return res.status(400).json({ success: false, message: 'Destination is required' });
    }
    const hotels = await searchHotels(
      destination,
      minRating ? parseFloat(minRating) : 4.0,
      maxPrice ? parseInt(maxPrice) : 15000
    );
    res.json({ success: true, hotels });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate distance and fuel cost
// @route   POST /api/trips/distance
// @access  Private
const getRouteDistance = async (req, res, next) => {
  try {
    const { startLocation, destination, vehicleType = 'car', fuelType = 'petrol', mileage = 15 } = req.body;
    if (!startLocation || !destination) {
      return res.status(400).json({ success: false, message: 'Start location and destination required' });
    }

    const oneWayDistanceKm = await calculateRouteDistance(startLocation, destination);
    const roundTripDistanceKm = oneWayDistanceKm * 2;
    const effectiveMileage = mileage > 0 ? mileage : vehicleType === 'car' ? 15 : 40;
    const fuelPricePerLiter = fuelType === 'diesel' ? 92 : 104;
    const fuelRequiredLiters = Number((roundTripDistanceKm / effectiveMileage).toFixed(1));
    const calculatedFuelCost = Math.round(fuelRequiredLiters * fuelPricePerLiter);

    res.json({
      success: true,
      distance: {
        vehicleType,
        fuelType,
        mileage: effectiveMileage,
        oneWayDistanceKm,
        roundTripDistanceKm,
        fuelRequiredLiters,
        fuelPricePerLiter,
        calculatedFuelCost,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res, next) => {
  try {
    const errors = validateTripInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const {
      destination,
      startLocation,
      startDate,
      endDate,
      travelers,
      budget,
      preferences,
      title,
      transportDetails,
      selectedHotel,
    } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    const trip = await Trip.create({
      userId: req.user._id,
      title: title || `${days}-Day ${destination} Trip`,
      destination,
      startLocation,
      startDate,
      endDate,
      days,
      travelers: travelers || { adults: 1, children: 0 },
      budget,
      preferences: preferences || {},
      transportDetails: transportDetails || {},
      selectedHotel: selectedHotel || null,
      status: 'draft',
    });

    res.status(201).json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate itinerary for a trip
// @route   POST /api/trips/:id/generate
// @access  Private
const generateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const tripData = {
      destination: trip.destination,
      startLocation: trip.startLocation,
      startDate: trip.startDate,
      endDate: trip.endDate,
      days: trip.days,
      travelers: trip.travelers,
      budget: trip.budget,
      preferences: trip.preferences,
      transportDetails: trip.transportDetails,
      selectedHotel: trip.selectedHotel,
    };

    const result = await planTrip(tripData);

    // Update trip with generated itinerary
    trip.title = result.tripTitle || trip.title;
    trip.summary = result.summary;
    trip.itinerary = result.days;
    trip.transportDetails = result.transportDetails || trip.transportDetails;
    trip.estimatedCost = result.estimatedCost;
    trip.budgetBreakdown = result.budgetBreakdown;
    trip.budgetStatus = result.budgetStatus;
    trip.tags = result.tags || [];
    trip.status = 'generated';

    await trip.save();

    logger.info(`Trip generated: ${trip._id} - ${trip.destination}`);
    res.json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Regenerate with instruction
// @route   POST /api/trips/:id/regenerate
// @access  Private
const regenerateTrip = async (req, res, next) => {
  try {
    const { instruction } = req.body;
    if (!instruction) {
      return res.status(400).json({ success: false, message: 'Instruction is required' });
    }

    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const result = await replanTrip(trip, instruction);

    trip.itinerary = result.days || trip.itinerary;
    trip.estimatedCost = result.estimatedCost || trip.estimatedCost;
    trip.budgetBreakdown = result.budgetBreakdown || trip.budgetBreakdown;
    trip.budgetStatus = result.budgetStatus || trip.budgetStatus;

    await trip.save();

    res.json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all user trips
// @route   GET /api/trips
// @access  Private
const getTrips = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { userId: req.user._id };
    if (status) query.status = status;

    const trips = await Trip.find(query)
      .select('-itinerary')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Trip.countDocuments(query);

    res.json({
      success: true,
      trips,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Private
const getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    res.json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const allowedUpdates = ['title', 'itinerary', 'status', 'budget', 'preferences', 'summary', 'transportDetails', 'selectedHotel'];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        trip[field] = req.body[field];
      }
    });

    await trip.save();
    res.json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Share a trip
// @route   POST /api/trips/:id/share
// @access  Private
const shareTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    if (!trip.shareId) {
      trip.shareId = crypto.randomBytes(6).toString('hex');
    }
    trip.isShared = true;
    trip.status = 'shared';
    await trip.save();

    const shareUrl = `${process.env.CLIENT_URL}/shared/${trip.shareId}`;
    res.json({ success: true, shareId: trip.shareId, shareUrl });
  } catch (error) {
    next(error);
  }
};

// @desc    Get shared trip (public)
// @route   GET /api/shared/:shareId
// @access  Public
const getSharedTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ shareId: req.params.shareId, isShared: true });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Shared trip not found' });
    }
    res.json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Save/unsave trip
// @route   PUT /api/trips/:id/save
// @access  Private
const saveTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    trip.status = trip.status === 'saved' ? 'generated' : 'saved';
    await trip.save();

    res.json({ success: true, trip, saved: trip.status === 'saved' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHotels,
  getRouteDistance,
  createTrip,
  generateTrip,
  regenerateTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  shareTrip,
  getSharedTrip,
  saveTrip,
};
