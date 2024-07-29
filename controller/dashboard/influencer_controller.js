const db = require("../../models");
// Create a new influencer
exports.addInfluencer = async function (req, res) {
  const {
    name,
    phone,
    email,
    coupon_code,
    expire_in,
    max_apply_limit,
    coupon_percentage,
  } = req.body;

  try {
    const existingEmail = await db.influencer.findOne({ where: { email } });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "Influencer with this mail already exists" });
    }

    // Check for duplicate phone
    const existingPhone = await db.influencer.findOne({ where: { phone } });
    if (existingPhone) {
      return res
        .status(400)
        .json({ message: "Influencer with this phone number already exists" });
    }

    const newInfluencer = await db.influencer.create({
      name,
      phone,
      email,
      coupon_code,
      expire_in,
      max_apply_limit,
      coupon_percentage,
      is_active: true,
    });

    res.status(201).json(newInfluencer);
  } catch (error) {
    console.error("Error adding influencer:", error);
    res.status(500).send({ message: "Error adding influencer" });
  }
};

// Get all influencers
exports.getInfluencers = async function (req, res) {
  try {
    const influencers = await db.influencer.findAll();
    res.status(200).send(influencers);
  } catch (error) {
    console.error("Error fetching influencers:", error);
    res.status(500).json({ error: "Failed to fetch influencers" });
  }
};

// Update an influencer
exports.updateInfluencer = async function (req, res) {
  const { id } = req.params;
  const {
    name,
    phone,
    email,
    coupon_code,
    expire_in,
    max_apply_limit,
    coupon_percentage,
    is_active,
  } = req.body;

  try {
    // Find the influencer by primary key
    const influencer = await db.influencer.findByPk(id);

    // If influencer not found, return a 404 error
    if (!influencer) {
      return res.status(404).json({ error: "Influencer not found" });
    }

    // Update the influencer with new data
    await influencer.update({
      name: name || influencer.name,
      phone: phone || influencer.phone,
      email: email || influencer.email,
      coupon_code: coupon_code || influencer.coupon_code,
      expire_in: expire_in || influencer.expire_in,
      max_apply_limit: max_apply_limit || influencer.max_apply_limit,
      coupon_percentage: coupon_percentage || influencer.coupon_percentage,
      is_active: is_active || influencer.is_active,
    });

    // Send the updated influencer data as response
    res.status(200).json(influencer);
  } catch (error) {
    console.error("Error updating influencer:", error);
    res.status(500).json({ error: "Failed to update influencer" });
  }
};

// Delete an influencer
exports.deleteInfluencer = async function (req, res) {
  const { id } = req.params;

  try {
    const influencer = await db.influencer.findByPk(id);

    if (!influencer) {
      return res.status(404).json({ error: "Influencer not found" });
    }

    await influencer.destroy();

    console.log(`Influencer with ID ${id} deleted successfully`);
    res.status(200).send({ message: "Influencer deleted successfully" });
  } catch (error) {
    console.error("Error deleting influencer:", error);
    res.status(500).json({ error: "Failed to delete influencer" });
  }
};
