const isCouponExpired = (expiryDate) => {
  // Convert the expiry date string to a Date object
  const expiry = new Date(expiryDate);

  // Get the current date and time
  const now = new Date();

  // Compare the dates
  return now > expiry;
};

module.exports = isCouponExpired;
