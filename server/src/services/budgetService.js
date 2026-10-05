const logger = require('../utils/logger');

/**
 * Calculate budget breakdown for a trip
 */
const calculateBudget = (tripData, places) => {
  const { days, travelers, budget, preferences } = tripData;
  const totalTravelers = (travelers?.adults || 1) + (travelers?.children || 0);
  const accommodation = preferences?.accommodation || 'mid-range';
  const transport = preferences?.transport?.[0] || 'car';

  const accommodationCostPerNight = getAccommodationCost(accommodation);
  const transportCost = getTransportCost(transport, days, tripData.startLocation, tripData.destination);
  const foodCostPerDay = getFoodCostPerDay(accommodation) * totalTravelers;
  const activityCostPerDay = getActivityCostPerDay(preferences?.interests || []) * totalTravelers;
  const miscPercentage = 0.08;

  const accomTotal = accommodationCostPerNight * (days - 1) * Math.ceil(totalTravelers / 2);
  const foodTotal = foodCostPerDay * days;
  const activityTotal = activityCostPerDay * days;
  const subtotal = transportCost + accomTotal + foodTotal + activityTotal;
  const miscTotal = Math.round(subtotal * miscPercentage);
  const total = subtotal + miscTotal;

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
