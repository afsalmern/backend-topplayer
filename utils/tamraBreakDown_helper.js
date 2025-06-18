const calculatePaymentDetails = (amount,currency) => {
  let variableFeePercentage, fixedFee, taxRate;


  console.log("CURREENCY INSIDE HELPER =========>", currency);

  // Set rates based on currency
  switch (currency) {
    case "SAR": // Saudi Arabia
      variableFeePercentage = 6.99;
      fixedFee = 1.5;
      taxRate = 15;
      break;
    case "AED": // United Arab Emirates
      variableFeePercentage = 5.99; // Assuming during pilot period
      fixedFee = 1.5;
      taxRate = 5;
      break;
    case "KWD": // Kuwait
      variableFeePercentage = 6.99;
      fixedFee = 0.12;
      taxRate = 0; // No tax specified
      break;
    default:
      throw new Error("Unsupported currency");
  }

  // Calculate fees and total amount
  const variableFee = (amount * variableFeePercentage) / 100;
  const totalFee = variableFee + fixedFee;
  const tax = (totalFee * taxRate) / 100;
  const totalDeductedAmount = totalFee + tax;
  const totalAmountAfterDeductions = amount - totalDeductedAmount;

  // Return or save these details as needed
  return {
    totalValue: amount,
    totalFee: totalFee.toFixed(2),
    tax: tax.toFixed(2),
    totalDeductedAmount: totalDeductedAmount.toFixed(2),
    totalAmountAfterDeductions: totalAmountAfterDeductions.toFixed(2),
  };
};

module.exports = calculatePaymentDetails;
