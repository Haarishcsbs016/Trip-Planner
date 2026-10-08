const express = require('express');
const router = express.Router();
const {
  createTrip,
  generateTrip,
  regenerateTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  shareTrip,
  saveTrip,
  getHotels,
  getRouteDistance,
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/hotels', getHotels);
router.post('/distance', getRouteDistance);

router.route('/').get(getTrips).post(createTrip);
router.route('/:id').get(getTrip).put(updateTrip).delete(deleteTrip);
router.post('/:id/generate', generateTrip);
router.post('/:id/regenerate', regenerateTrip);
router.post('/:id/share', shareTrip);
router.put('/:id/save', saveTrip);

module.exports = router;
