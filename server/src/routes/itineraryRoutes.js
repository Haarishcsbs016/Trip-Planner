const express = require('express');
const router = express.Router();
const { getSharedTrip } = require('../controllers/tripController');

// Public shared trip access
router.get('/:shareId', getSharedTrip);

module.exports = router;
