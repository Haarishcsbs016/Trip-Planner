const axios = require('axios');
const logger = require('../utils/logger');

const MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const PLACES_BASE = 'https://maps.googleapis.com/maps/api/place';
const DISTANCE_BASE = 'https://maps.googleapis.com/maps/api/distancematrix';
const GEOCODE_BASE = 'https://maps.googleapis.com/maps/api/geocode';

/**
 * Search for places near destination
 */
const searchPlaces = async (destination, type = 'tourist_attraction', maxResults = 10) => {
  if (!MAPS_API_KEY) {
    logger.warn('Google Maps API key not configured. Using sample places data.');
    return getSamplePlaces(destination, type);
  }

  try {
    // First geocode the destination
    const geoRes = await axios.get(`${GEOCODE_BASE}/json`, {
      params: { address: destination, key: MAPS_API_KEY },
    });

    if (geoRes.data.status !== 'OK') {
      return getSamplePlaces(destination, type);
    }

    const location = geoRes.data.results[0].geometry.location;
    const locationStr = `${location.lat},${location.lng}`;

    const placesRes = await axios.get(`${PLACES_BASE}/nearbysearch/json`, {
      params: {
        location: locationStr,
        radius: 15000,
        type,
        key: MAPS_API_KEY,
        rankby: 'prominence',
      },
    });

    return placesRes.data.results.slice(0, maxResults).map((place) => ({
      placeId: place.place_id,
      name: place.name,
      rating: place.rating,
      address: place.vicinity,
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
      types: place.types,
      openNow: place.opening_hours?.open_now,
      photoRef: place.photos?.[0]?.photo_reference,
      priceLevel: place.price_level,
    }));
  } catch (error) {
    logger.error('Maps API error:', error.message);
    return getSamplePlaces(destination, type);
  }
};

/**
 * Calculate distances between places
 */
const calculateDistances = async (origins, destinations) => {
  if (!MAPS_API_KEY) {
    return null;
  }

  try {
    const res = await axios.get(`${DISTANCE_BASE}/json`, {
      params: {
        origins: origins.join('|'),
        destinations: destinations.join('|'),
        mode: 'driving',
        key: MAPS_API_KEY,
        units: 'metric',
      },
    });

    return res.data;
  } catch (error) {
    logger.error('Distance Matrix API error:', error.message);
    return null;
  }
};

/**
 * Geocode a location to lat/lng
 */
const geocodeLocation = async (address) => {
  if (!MAPS_API_KEY) {
    return null;
  }

  try {
    const res = await axios.get(`${GEOCODE_BASE}/json`, {
      params: { address, key: MAPS_API_KEY },
    });

    if (res.data.status === 'OK') {
      return res.data.results[0].geometry.location;
    }
    return null;
  } catch (error) {
    logger.error('Geocoding error:', error.message);
    return null;
  }
};

const getSamplePlaces = (destination, type) => {
  const sampleAttractions = [
    { name: `${destination} Heritage Park`, rating: 4.5, address: `Central ${destination}`, types: ['park', 'tourist_attraction'] },
    { name: `${destination} Botanical Garden`, rating: 4.3, address: `North ${destination}`, types: ['botanical_garden'] },
    { name: `${destination} Lake`, rating: 4.6, address: `East ${destination}`, types: ['natural_feature'] },
    { name: `${destination} Museum`, rating: 4.2, address: `South ${destination}`, types: ['museum'] },
    { name: `${destination} Viewpoint`, rating: 4.7, address: `Hill Top, ${destination}`, types: ['point_of_interest'] },
    { name: `${destination} Market`, rating: 4.1, address: `Market Street, ${destination}`, types: ['shopping'] },
  ];

  const sampleRestaurants = [
    { name: `Spice Garden Restaurant`, rating: 4.4, address: `Main Road, ${destination}`, types: ['restaurant'] },
    { name: `The Green Leaf Cafe`, rating: 4.5, address: `Park Lane, ${destination}`, types: ['cafe'] },
    { name: `Local Delights`, rating: 4.3, address: `Food Street, ${destination}`, types: ['restaurant'] },
    { name: `Mountain View Diner`, rating: 4.2, address: `View Point Road, ${destination}`, types: ['restaurant'] },
  ];

  return (type === 'restaurant' ? sampleRestaurants : sampleAttractions).map((p, i) => ({
    placeId: `sample_${i}`,
    location: { lat: 11.4 + i * 0.01, lng: 76.7 + i * 0.01 },
    simulated: true,
    ...p,
  }));
};

module.exports = { searchPlaces, calculateDistances, geocodeLocation };
