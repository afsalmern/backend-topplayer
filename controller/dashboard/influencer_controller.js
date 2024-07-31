const { where } = require("sequelize");
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

    res.status(201).send({ message: "Influencer added successfully" });
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
    res.status(200).send({ message: "Influencer updated successfully" });
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

exports.getOrdersInflucencers = async function (req, res) {
  try {
    const { from, to, influencer } = req.params;

    const addOneDay = (date) => {
      const result = new Date(date);
      result.setDate(result.getDate() + 1);
      return result;
    };

    // Define where conditions for payment and influencer
    const paymentWhere = {};
    const influencerWhere = {};

    // Check and set conditions for date filters
    if (from && to) {
      // If both 'from' and 'to' are provided, filter by date range
      paymentWhere.createdAt = {
        [db.Sequelize.Op.between]: [new Date(from), addOneDay(new Date(to))],
      };
    } else if (from) {
      // If only 'from' is provided, filter from 'from' date onwards
      paymentWhere.createdAt = {
        [db.Sequelize.Op.gte]: new Date(from),
      };
    } else if (to) {
      // If only 'to' is provided, filter up to 'to' date
      paymentWhere.createdAt = {
        [db.Sequelize.Op.lte]: new Date(to),
      };
    }

    // Set condition for influencer if provided
    if (influencer !== "all") {
      influencerWhere.name = {
        [db.Sequelize.Op.like]: `%${influencer}%`, // Using LIKE for partial matching
      };
    }

    const paymentWithCoupons = await db.payment.findAll({
      include: [
        {
          model: db.influencer,
          where: influencerWhere,
          through: {
            model: db.paymentWithCoupon,
            attributes: [], // Include influencerId from the join table
          },
          attributes: [], // Exclude coupon attributes
        },
      ],
      where: paymentWhere,
      attributes: [
        [db.Sequelize.literal("FORMAT(SUM(net_amount), 2)"), "totalRevenue"],
        [db.Sequelize.literal("FORMAT(SUM(amount), 2)"), "totalPayment"],
        [
          db.Sequelize.fn("COUNT", db.Sequelize.col("net_amount")),
          "totalOrders",
        ],
        [db.Sequelize.col("influencers.id"), "influencerId"],
        [db.Sequelize.col("influencers.name"), "influencerName"],
        [db.Sequelize.col("influencers.coupon_code"), "couponCode"],
      ],
      group: ["influencers.id"], // Group by influencerId in the join table
      raw: true,
    });

    res.status(200).send({ paymentWithCoupons });
  } catch (error) {
    console.error("Error getting influencer orders:", error);
    res.status(500).json({ error: "Failed to get influencer orders" });
  }
};
