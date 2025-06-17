// const calculatePaymentDetails = (amount,currency) => {
//   let variableFeePercentage, fixedFee, taxRate;

//   console.log("CURREENCY INSIDE HELPER =========>", currency);

//   // Set rates based on currency
//   switch (currency) {
//     case "SAR": // Saudi Arabia
//       variableFeePercentage = 6.99;
//       fixedFee = 1.5;
//       taxRate = 15;
//       break;
//     case "AED": // United Arab Emirates
//       variableFeePercentage = 5.99; // Assuming during pilot period
//       fixedFee = 1.5;
//       taxRate = 5;
//       break;
//     case "KWD": // Kuwait
//       variableFeePercentage = 6.99;
//       fixedFee = 0.12;
//       taxRate = 0; // No tax specified
//       break;
//     default:
//       throw new Error("Unsupported currency");
//   }

//   // Calculate fees and total amount
//   const variableFee = (amount * variableFeePercentage) / 100;
//   const totalFee = variableFee + fixedFee;
//   const tax = (totalFee * taxRate) / 100;
//   const totalDeductedAmount = totalFee + tax;
//   const totalAmountAfterDeductions = amount - totalDeductedAmount;

const calculatePaymentDetails = (amount, currency) => {
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
  const totalAmountAfterDeductions = Number((amount - totalDeductedAmount).toFixed(2));

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
