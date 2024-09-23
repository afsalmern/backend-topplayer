const db = require("../models");

const convertAmountForStripe = async (baseAmount, currencyCode) => {
  console.log(baseAmount);
  console.log(currencyCode);
  // Find the currency details from the database
  const currency = await db.currency.findOne({
    where: { currency_code: currencyCode.toUpperCase() },
  });

  if (!currency) {
    throw new Error(`Currency ${currencyCode} not found`);
  }

  // Determine decimal places based on the currency
  let decimalPlaces;
  switch (currency.currency_code) {
    case "KWD": // Kuwait Dinar
    case "BHD": // Bahraini Dinar
    case "OMR": // Omani Rial
    case "JOD": // Jordanian Dinar
    case "TND": 
      decimalPlaces = 3; // These currencies have 3 decimal places
      break;
    default:
      decimalPlaces = 2; // Most other currencies like AED, USD, SAR, QAR use 2 decimal places
      break;
    }
    
    console.log(decimalPlaces);
    

  // Convert the amount to the smallest currency unit
  const amount = Math.round(baseAmount * Math.pow(10, decimalPlaces));

  return amount;
};

module.exports = convertAmountForStripe;
