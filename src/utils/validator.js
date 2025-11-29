export const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isStrongPassword = (pwd) => {
  if (typeof pwd !== 'string') return false;
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return re.test(pwd);
};

export const validateUser = (data) => {
  const errors = [];
  if (!data) {
    errors.push('User data is required');
    return errors;
  }
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required');
  }
  if (!data.password || !isStrongPassword(data.password)) {
    errors.push('Password must be at least 8 characters long and include uppercase, lowercase and a number');
  }
  if (data.username && typeof data.username !== 'string') {
    errors.push('Username must be a string');
  }
  return errors;
};

export const validateAccommodation = (data) => {
  const errors = [];
  if (!data) {
    errors.push('Accommodation data is required');
    return errors;
  }
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required and must be a string');
  }
  if (!data.location || typeof data.location !== 'string') {
    errors.push('Location is required and must be a string');
  }
  if (data.pricePerNight == null || typeof data.pricePerNight !== 'number' || data.pricePerNight <= 0) {
    errors.push('pricePerNight is required and must be a positive number');
  }
  if (data.maxGuests == null || !Number.isInteger(data.maxGuests) || data.maxGuests <= 0) {
    errors.push('maxGuests is required and must be a positive integer');
  }
  return errors;
};

export const validateBooking = (data) => {
  const errors = [];
  if (!data) {
    errors.push('Booking data is required');
    return errors;
  }
  if (!data.accommodationId) {
    errors.push('accommodationId is required');
  }
  if (!data.userId) {
    errors.push('userId is required');
  }
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  if (isNaN(start) || isNaN(end)) {
    errors.push('Valid startDate and endDate are required');
  } else if (start >= end) {
    errors.push('startDate must be before endDate');
  }
  return errors;
};

export const validateReview = (data) => {
  const errors = [];
  if (!data) {
    errors.push('Review data is required');
    return errors;
  }
  if (!data.accommodationId) {
    errors.push('accommodationId is required');
  }
  if (!data.userId) {
    errors.push('userId is required');
  }
  if (data.rating == null || typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) {
    errors.push('rating must be a number between 1 and 5');
  }
  if (data.comment && typeof data.comment !== 'string') {
    errors.push('comment must be a string');
  }
  return errors;
};

export const validateMessage = (data) => {
  const errors = [];
  if (!data) {
    errors.push('Message data is required');
    return errors;
  }
  if (!data.senderId) {
    errors.push('senderId is required');
  }
  if (!data.receiverId) {
    errors.push('receiverId is required');
  }
  if (!data.content || typeof data.content !== 'string' || data.content.trim() === '') {
    errors.push('content is required and must be a non‑empty string');
  }
  return errors;
};