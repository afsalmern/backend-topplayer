const { where } = require("sequelize");
const db = require("../../models");

exports.addCurrency = (req, res, next) => {
  const { currency_name, currency_flag, currency_code, currency_rate } =
    req.body;

  db.currency
    .create({
      currency_name,
      currency_flag,
      currency_code,
      currency_rate,
    })
    .then((result) => {
      console.log(`a currency added successfully`);
      res.status(200).send({ message: "Currency added successfully" });
    })
    .catch((err) => {
      console.error(`error in adding currency ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

exports.getAllCurrencies = (req, res, next) => {
  db.currency
    .findAll({
      where: { isDeleted: false }, // Condition to retrieve only non-deleted categories
      order: [["createdAt", "DESC"]],
    })
    .then((currencies) => {
      console.log(`Retrieved all currencies successfully`);
      res.status(200).send({ currencies });
    })
    .catch((err) => {
      console.error(`Error in retrieving currencies: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

exports.updateCurrency = (req, res, next) => {
  const currencyId = req.params.id;
  db.currency
    .findByPk(currencyId)
    .then((currency) => {
      if (!currency) {
        return res.status(404).send({ message: "Currency not found" });
      }
      return currency.update({
        currency_name: req.body.currency_name || currency.currency_name,
        currency_flag: req.body.currency_flag || currency.currency_flag,
        currency_code: req.body.currency_code || currency.currency_code,
        currency_rate: req.body.currency_rate || currency.currency_rate,
        isActive:
          req.body.isActive !== null ? req.body.isActive : currency.isActive,
      });
    })
    .then((updatedCurrency) => {
      console.log(`Currency with ID ${currencyId} updated successfully`);
      res.status(200).send({
        message: "Currency updated successfully",
        currency: updatedCurrency,
      });
    })
    .catch((err) => {
      console.error(`Error in updating currency: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

exports.deleteCurrency = async (req, res, next) => {
  const currencyId = req.params.id;

  try {
    // Find the currency by ID
    const currency = await db.currency.findByPk(currencyId);

    // If currency not found, return 404
    if (!currency) {
      return res.status(404).send({ message: "Currency not found" });
    }

    // Soft delete the currency by setting isDeleted to true and save the changes
    currency.isDeleted = true;
    await currency.save();

    console.log(`Currency with ID ${currencyId} soft deleted successfully`);
    res.status(200).send({ message: "Currency deleted successfully" });
  } catch (err) {
    console.error(`Error in deleting currency: ${err.toString()}`);
    res.status(500).send({ message: err.toString() });
  }
};
