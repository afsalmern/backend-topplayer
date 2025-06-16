const { parsePhoneNumberFromString } = require("libphonenumber-js/mobile");
const countries = require("i18n-iso-countries"); // For converting country code to country name

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

const getCountryFromPhone = (mobile) => {
  const fullNumber = mobile;
  const phoneNumberObj = parsePhoneNumberFromString(fullNumber);

  let countryName = "Unknown";

  if (phoneNumberObj && phoneNumberObj.isValid()) {
    const countryAlpha2 = phoneNumberObj.country;
    countryName = countries.getName(countryAlpha2, "en") || "Unknown";
  }

  return countryName;
};

module.exports = getCountryFromPhone;
