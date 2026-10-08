const { getWeatherForecast } = require('./weatherService');
const { searchPlaces, calculateRouteDistance } = require('./mapsService');
const { generateItinerary, regenerateItinerary } = require('./aiService');
const { calculateBudget } = require('./budgetService');
const logger = require('../utils/logger');

/**
 * Orchestrate the full trip planning pipeline
 */
const planTrip = async (tripData) => {
  logger.info(`Planning trip: ${tripData.startLocation} → ${tripData.destination}, ${tripData.days} days`);

  // Step 1: Calculate route distance and fuel cost if car or bike
  let updatedTransportDetails = tripData.transportDetails || {};
  if (tripData.startLocation && tripData.destination) {
    const oneWayDistanceKm = await calculateRouteDistance(tripData.startLocation, tripData.destination);
    const roundTripDistanceKm = oneWayDistanceKm * 2;
    const vehicleType = updatedTransportDetails.vehicleType || (tripData.preferences?.transport?.[0] === 'bike' ? 'bike' : 'car');
    const fuelType = updatedTransportDetails.fuelType || 'petrol';
    const mileage = updatedTransportDetails.mileage || (vehicleType === 'car' ? 15 : 40);
    const fuelPrice = fuelType === 'diesel' ? 92 : 104;
    const fuelRequiredLiters = Number((roundTripDistanceKm / mileage).toFixed(1));
    const calculatedFuelCost = Math.round(fuelRequiredLiters * fuelPrice);

    updatedTransportDetails = {
      vehicleType,
      fuelType,
      mileage,
      oneWayDistanceKm,
      roundTripDistanceKm,
      fuelRequiredLiters,
      fuelPricePerLiter: fuelPrice,
      calculatedFuelCost,
    };
  }

  const enrichedTripData = {
    ...tripData,
    transportDetails: updatedTransportDetails,
  };

  // Step 2: Fetch context data in parallel
  const [places, restaurants, weather] = await Promise.allSettled([
    searchPlaces(tripData.destination, 'tourist_attraction', 10),
    searchPlaces(tripData.destination, 'restaurant', 8),
    getWeatherForecast(tripData.destination, tripData.startDate, tripData.days),
  ]);

  const contextData = {
    places: places.status === 'fulfilled' ? places.value : [],
    restaurants: restaurants.status === 'fulfilled' ? restaurants.value : [],
    weather: weather.status === 'fulfilled' ? weather.value : [],
  };

  logger.info(`Context: ${contextData.places.length} places, ${contextData.restaurants.length} restaurants, ${contextData.weather.length} weather days`);

  // Step 3: Calculate budget breakdown
  const budgetResult = calculateBudget(enrichedTripData, contextData.places);

  // Step 4: Generate AI itinerary
  const aiResult = await generateItinerary(enrichedTripData, contextData);

  // Step 5: Merge weather into itinerary days
  const enrichedDays = (aiResult.days || []).map((day, index) => ({
    ...day,
    weather: contextData.weather[index] || null,
  }));

  return {
    ...aiResult,
    days: enrichedDays,
    transportDetails: updatedTransportDetails,
    budgetBreakdown: budgetResult.breakdown,
    budgetStatus: budgetResult.budgetStatus,
    estimatedCost: budgetResult.total,
    contextData: {
      placesCount: contextData.places.length,
      weatherDays: contextData.weather.length,
    },
  };
};

/**
 * Regenerate with a specific instruction
 */
const replanTrip = async (existingTrip, instruction) => {
  logger.info(`Replanning trip: "${instruction}" for ${existingTrip.destination}`);
  const result = await regenerateItinerary(existingTrip, instruction);
  const recalcBudget = calculateBudget(existingTrip, []);

  return {
    ...result,
    budgetBreakdown: recalcBudget.breakdown,
    estimatedCost: recalcBudget.total,
    budgetStatus: recalcBudget.budgetStatus,
  };
};

module.exports = { planTrip, replanTrip };
