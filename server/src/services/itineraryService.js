const { getWeatherForecast } = require('./weatherService');
const { searchPlaces } = require('./mapsService');
const { generateItinerary, regenerateItinerary } = require('./aiService');
const { calculateBudget } = require('./budgetService');
const logger = require('../utils/logger');

/**
 * Orchestrate the full trip planning pipeline
 */
const planTrip = async (tripData) => {
  logger.info(`Planning trip: ${tripData.startLocation} → ${tripData.destination}, ${tripData.days} days`);

  // Step 1: Fetch context data in parallel
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

  // Step 2: Calculate budget breakdown
  const budgetResult = calculateBudget(tripData, contextData.places);

  // Step 3: Generate AI itinerary
  const aiResult = await generateItinerary(tripData, contextData);

  // Step 4: Merge weather into itinerary days
  const enrichedDays = (aiResult.days || []).map((day, index) => ({
    ...day,
    weather: contextData.weather[index] || null,
  }));

  return {
    ...aiResult,
    days: enrichedDays,
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
