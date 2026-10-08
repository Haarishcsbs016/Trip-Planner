const logger = require('../utils/logger');

/**
 * Calculate budget breakdown for a trip
 */
const calculateBudget = (tripData, places) => {
  const { days, travelers, budget, preferences, transportDetails, selectedHotel } = tripData;
  const totalTravelers = (travelers?.adults || 1) + (travelers?.children || 0);

  // 1. Accommodation Cost
  let accomTotal = 0;
  const nights = Math.max(1, days - 1);
  const roomsNeeded = Math.ceil(totalTravelers / 2);

  if (selectedHotel && selectedHotel.pricePerNight) {
    accomTotal = selectedHotel.pricePerNight * nights * roomsNeeded;
  } else {
    const accommodation = preferences?.accommodation || 'mid-range';
    const accommodationCostPerNight = getAccommodationCost(accommodation);
    accomTotal = accommodationCostPerNight * nights * roomsNeeded;
  }

  // 2. Transportation Cost
  let transportCost = 0;
  if (transportDetails && transportDetails.calculatedFuelCost > 0) {
    transportCost = transportDetails.calculatedFuelCost;
  } else if (
    transportDetails &&
    (transportDetails.vehicleType === 'car' || transportDetails.vehicleType === 'bike')
  ) {
    const vehicle = transportDetails.vehicleType;
    const mileage = transportDetails.mileage || (vehicle === 'car' ? 15 : 40);
    const fuelPrice =
      transportDetails.fuelPricePerLiter ||
      (transportDetails.fuelType === 'diesel' ? 92 : 104);
    const distance = transportDetails.oneWayDistanceKm || 300;
    const roundTrip = distance * 2;
    const litersNeeded = roundTrip / mileage;
    transportCost = Math.round(litersNeeded * fuelPrice);
  } else {
    const transport = preferences?.transport?.[0] || 'car';
    transportCost = getTransportCost(transport, days, tripData.startLocation, tripData.destination);
  }

  // 3. Food & Activities Cost
  const accommodationType = selectedHotel ? 'hotel' : preferences?.accommodation || 'mid-range';
  const foodCostPerDay = getFoodCostPerDay(accommodationType) * totalTravelers;
  const activityCostPerDay = getActivityCostPerDay(preferences?.interests || []) * totalTravelers;

  const foodTotal = foodCostPerDay * days;
  const activityTotal = activityCostPerDay * days;

  const subtotal = transportCost + accomTotal + foodTotal + activityTotal;
  const miscPercentage = 0.08;
  const miscTotal = Math.round(subtotal * miscPercentage);
  const total = Math.round(subtotal + miscTotal);

  const breakdown = {
    transportation: Math.round(transportCost),
    accommodation: Math.round(accomTotal),
    food: Math.round(foodTotal),
    activities: Math.round(activityTotal),
    miscellaneous: Math.round(miscTotal),
    total: Math.round(total),
  };

  const budgetStatus = total <= budget ? 'within' : 'over';
  const difference = Math.abs(total - budget);

  return {
    breakdown,
    budgetStatus,
    difference,
    total: Math.round(total),
    withinBudget: total <= budget,
  };
};

const getAccommodationCost = (type) => {
  const costs = {
    budget: 800,
    hostel: 600,
    'mid-range': 1500,
    hotel: 2000,
    resort: 3500,
    luxury: 6000,
  };
  return costs[type?.toLowerCase()] || 1500;
};

const getTransportCost = (transport, days, from, to) => {
  const baseCosts = {
    flight: 4500,
    train: 1200,
    bus: 600,
    car: 2000,
    bike: 500,
    'rental car': 2500,
  };
  const base = baseCosts[transport?.toLowerCase()] || 1500;
  // Round trip
  return base * 2 + (transport === 'car' || transport === 'rental car' ? days * 400 : 0);
};

const getFoodCostPerDay = (accommodation) => {
  const costs = {
    budget: 300,
    hostel: 300,
    'mid-range': 600,
    hotel: 700,
    resort: 1000,
    luxury: 1500,
  };
  return costs[accommodation?.toLowerCase()] || 500;
};

const getActivityCostPerDay = (interests) => {
  let base = 300;
  const interestMultipliers = {
    luxury: 500,
    adventure: 200,
    shopping: 300,
    culture: 150,
    food: 200,
    nature: 100,
    photography: 50,
    relaxation: 100,
    history: 100,
  };

  interests.forEach((interest) => {
    base += interestMultipliers[interest?.toLowerCase()] || 0;
  });

  return Math.min(base, 1000);
};

module.exports = { calculateBudget };
