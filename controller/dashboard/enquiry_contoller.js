const db = require("../../models");

exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await db.contact.findAll({
      order: [["createdAt", "DESC"]], // Order by createdAt column in descending order
    });
    res.status(200).json(enquiries);
  } catch (error) {
    console.error(`Error in retrieving enquiries: ${error.toString()}`);
    res.status(500).send({ message: error.toString() });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiryId = req.params.id;
    const enquiry = await db.contact.findByPk(enquiryId);
    if (!enquiry) {
      res.status(404).send({ message: "Enquiry not found" });
    } else {
      await enquiry.destroy();
      res.status(200).send({ message: "Enquiry deleted successfully" });
    }
  } catch (error) {
    console.error(`Error in retrieving enquiries: ${error.toString()}`);
    res.status(500).send({ message: error.toString() });
  }
};
