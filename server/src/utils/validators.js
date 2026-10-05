const validateTripInput = (data) => {
  const errors = [];

  if (!data.destination || data.destination.trim().length < 2) {
    errors.push('Destination must be at least 2 characters');
  }

  if (!data.startLocation || data.startLocation.trim().length < 2) {
    errors.push('Starting location must be at least 2 characters');
  }

  if (!data.startDate) {
    errors.push('Start date is required');
  }

  if (!data.endDate) {
    errors.push('End date is required');
  }

  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (end <= start) {
      errors.push('End date must be after start date');
    }
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (days > 30) {
      errors.push('Trip cannot exceed 30 days');
    }
  }

  if (!data.budget || data.budget < 500) {
    errors.push('Budget must be at least ₹500');
  }

  if (!data.travelers || (!data.travelers.adults && !data.travelers.children)) {
    errors.push('At least 1 traveler is required');
  }

  return errors;
};

const validateEmail = (email) => {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email);
};

module.exports = { validateTripInput, validateEmail };
