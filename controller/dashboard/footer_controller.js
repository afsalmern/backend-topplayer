const db = require("../../models");

// Add a new footer
const addFooter = async (req, res) => {
  try {
    const { footer_en, footer_ar } = req.body;
    const newFooter = await db.footer.create({ footer_en, footer_ar });
    res
      .status(201)
      .json({ message: "Footer added successfully", data: newFooter });
  } catch (error) {
    console.log("error in footer", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Get all footers
const getAllFooters = async (req, res) => {
  try {
    const footers = await db.footer.findAll();
    res.status(200).json({ data: footers });
  } catch (error) {
    console.log("error in footer", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Update a footer by ID
const updateFooter = async (req, res) => {
  try {
    const { id } = req.params;
    const { footer_en, footer_ar } = req.body;
    const footer = await db.footer.findByPk(id);

    if (!footer) {
      return res.status(404).json({ message: "Footer not found" });
    }

    await footer.update({
      footer_en: footer_en || footer.footer_en,
      footer_ar: footer_ar || footer.footer_ar,
    });

    res.status(200).json({ message: "Footer updated successfully" });
  } catch (error) {
    console.log("error in footer", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Delete a footer by ID
const deleteFooter = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFooter = await db.footer.destroy({ where: { id } });
    if (deletedFooter === 0) {
      return res.status(404).json({ message: "Footer not found" });
    }
    res.status(200).json({ message: "Footer deleted successfully" });
  } catch (error) {
    console.log("error in footer", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = {
  addFooter,
  getAllFooters,
  updateFooter,
  deleteFooter,
};
