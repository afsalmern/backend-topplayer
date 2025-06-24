const getTamaraBreakDowns = (amount, currency) => {
  // Input validation
  if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }
  if (typeof currency !== "string" || !currency.trim()) {
    throw new Error("Currency must be a non-empty string");
  }

  // Currency configuration
  const currencyConfig = {
    SAR: { variableFeePercentage: 6.99, fixedFee: 1.5, taxRate: 15 },
    AED: { variableFeePercentage: 5.99, fixedFee: 1.5, taxRate: 5 },
    KWD: { variableFeePercentage: 6.99, fixedFee: 0.12, taxRate: 0 },
  };

  // Check for supported currency
  if (!currencyConfig[currency]) {
    throw new Error(`Unsupported currency: ${currency}`);
  }

  const { variableFeePercentage, fixedFee, taxRate } = currencyConfig[currency];

  // Calculate fees with intermediate rounding to 2 decimal places
  const variableFee = Number(((amount * variableFeePercentage) / 100).toFixed(2));
  const totalFee = Number((variableFee + fixedFee).toFixed(2));
  const tax = Number(((totalFee * taxRate) / 100).toFixed(2));
  const totalDeductedAmount = Number((totalFee + tax).toFixed(2));
  let totalAmountAfterDeductions = Number((amount - totalDeductedAmount).toFixed(2));

  let currentSARtoAED = 0.98;
  let currentKWDtoAED = 12.0;

  switch (currency) {
    case "SAR":
      // Convert SAR to AED
      totalAmountAfterDeductions = Number((totalAmountAfterDeductions * currentSARtoAED).toFixed(2));
      break;
    case "KWD":
      // Convert KWD to AED
      totalAmountAfterDeductions = Number((totalAmountAfterDeductions * currentKWDtoAED).toFixed(2));
      break;
    case "AED":
      // No conversion needed for AED
      break;
    default:
      throw new Error(`Unsupported currency: ${currency}`);
  }

  // Return standardized payment details
  return {
    totalValue: amount.toFixed(2),
    variableFee: variableFee.toFixed(2),
    fixedFee: fixedFee.toFixed(2),
    totalFee: totalFee.toFixed(2),
    tax: tax.toFixed(2),
    totalDeductedAmount: totalDeductedAmount.toFixed(2),
    totalAmountAfterDeductions: totalAmountAfterDeductions.toFixed(2),
    currency,
  };
};

module.exports = {
  getTamaraBreakDowns,
};
