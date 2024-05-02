const db = require("../../models");

exports.addTermsAndConditions = async (req, res, next) => {
  const { content, content_ar } = req.body;

  try {
    await db.termsAndConditions.create({ content: content, content_ar: content_ar });
    console.log("Terms and conditions added successfully");
    res.status(200).json({ message: "Terms and conditions added successfully" });
  } catch (error) {
    console.error("Error adding terms and conditions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getTermsAndConditions = async (req, res, next) => {
  try {
    const termsAndConditions = await db.termsAndConditions.findAll();
    res.status(200).json(termsAndConditions);
  } catch (error) {
    console.error("Error listing terms and conditions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateTermsAndConditions = async (req, res, next) => {
  const { id } = req.params;
  const { content, content_ar } = req.body;

  try {
    await db.termsAndConditions.update({ content: content, content_ar: content_ar }, { where: { id } });
    console.log("Terms and conditions updated successfully");
    res.status(200).json({ message: "Terms and conditions updated successfully" });
  } catch (error) {
    console.error("Error updating terms and conditions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteTermsAndConditions = async (req, res, next) => {
  const { id } = req.params;

  try {
    await db.termsAndConditions.destroy({ where: { id } });
    console.log("Terms and conditions deleted successfully");
    res.status(200).json({ message: "Terms and conditions deleted successfully" });
  } catch (error) {
    console.error("Error deleting terms and conditions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
