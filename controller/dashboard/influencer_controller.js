const { where, Op } = require("sequelize");
const db = require("../../models");
// Create a new influencer
exports.addInfluencer = async function (req, res) {
  const { coupon_code, expire_in, start_in, max_apply_limit, coupon_percentage, commision_percentage, influencer } = req.body;

  try {
    const existingCouponCode = await db.influencer.findOne({
      where: { coupon_code },
    });

    if (existingCouponCode) {
      return res.status(500).json({
        message: "Coupon code already exists. Please choose a different one.",
      });
    }

    const startDate = new Date(start_in);
    const expiryDate = new Date(expire_in);

    if (
      startDate.getFullYear() === expiryDate.getFullYear() &&
      startDate.getMonth() === expiryDate.getMonth() &&
      startDate.getDate() === expiryDate.getDate()
    ) {
      // Set expiryDate to the end of the day
      expiryDate.setHours(23, 59, 59, 999);
    }

    // Check if start date is not less than expiry date
    if (startDate > expiryDate) {
      return res.status(400).json({
        message: "The start date must be earlier than the expiry date.",
      });
    }

    const createdCoupon = await db.influencer.create({
      coupon_code: coupon_code.trim(),
      expire_in,
      start_in,
      max_apply_limit: 0,
      coupon_percentage,
      commision_percentage,
      is_active: true,
    });

    const coupon_id = createdCoupon?.id;

    await db.InfluencerCoupons.create({
      influencer_id: influencer,
      coupon_id,
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
    const influencers = await db.influencer.findAll({
      attributes: [
        "id",
        "name",
        "phone",
        "email",
        "coupon_code",
        "start_in",
        "expire_in",
        "is_active",
        "max_apply_limit",
        "coupon_percentage",
        "commision_percentage",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "DESC"]], // Order by latest created records
    });

    const updatedInfluencers = influencers.map((influencer) => {
      const currentDate = new Date();
      const startDate = new Date(influencer.start_in);
      const expiryDate = new Date(influencer.expire_in);

      const formatDate = (date) => date.toISOString().split("T")[0];

      const currentFormatted = formatDate(currentDate);
      const startFormatted = formatDate(startDate);
      const expiryFormatted = formatDate(expiryDate);

      let status;

      if (currentFormatted > expiryFormatted) {
        status = "expired";
      } else if (currentFormatted < startFormatted) {
        status = "to be active";
      } else if (currentFormatted >= startFormatted && currentFormatted <= expiryFormatted) {
        status = "active";
      }

      return {
        ...influencer.toJSON(), // Convert the Sequelize instance to a plain object
        status,
      };
    });

    res.status(200).send(updatedInfluencers);
  } catch (error) {
    console.error("Error fetching influencers:", error);
    res.status(500).json({ error: "Failed to fetch influencers" });
  }
};

exports.updateInfluencer = async function (req, res) {
  const { id } = req.params;
  const { coupon_code, expire_in, start_in, max_apply_limit, coupon_percentage, commision_percentage, is_active } = req.body;

  try {
    // Find the influencer by primary key
    const influencer = await db.influencer.findByPk(id);

    // If influencer not found, return a 404 error
    if (!influencer) {
      return res.status(404).json({ error: "Influencer not found" });
    }

    // Check if the coupon code is already in use by another influencer

    const existingCouponCode = await db.influencer.findOne({
      where: {
        coupon_code,
        id: { [db.Sequelize.Op.ne]: id }, // Exclude the current influencer
      },
    });

    if (existingCouponCode) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    // Update the influencer with new data
    await influencer.update({
      // name: name || influencer.name,
      // phone: phone || influencer.phone,
      // email: email || influencer.email,
      coupon_code: coupon_code.trim() || influencer.coupon_code,
      expire_in: expire_in || influencer.expire_in,
      start_in: start_in || influencer.start_in,
      max_apply_limit: max_apply_limit || influencer.max_apply_limit,
      coupon_percentage: coupon_percentage || influencer.coupon_percentage,
      commision_percentage: commision_percentage || influencer.commision_percentage,
      is_active: is_active || influencer.is_active,
    });

    // Send the updated influencer data as response
    res.status(200).send({ message: "Influencer updated successfully" });
  } catch (error) {
    console.error("Error updating influencer:", error);
    res.status(500).json({ error: "Failed to update influencer" });
  }
};

exports.updateInfluencerStatus = async function (req, res) {
  const { id } = req.params;
  const { is_active } = req.body;

  try {
    // Find the influencer by primary key
    const influencer = await db.influencer.findByPk(id);

    // If influencer not found, return a 404 error
    if (!influencer) {
      return res.status(404).json({ error: "Influencer not found" });
    }

    // Update the influencer with new data
    await influencer.update({
      is_active: is_active,
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
          through: {
            model: db.paymentWithCoupon,
            attributes: [],
          },
          attributes: [],
          include: [
            {
              model: db.influencerPersons,
              where: influencerWhere,
              through: {
                model: db.InfluencerCoupons,
                attributes: [],
              },
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      where: paymentWhere,
      attributes: [
        [db.Sequelize.literal("FORMAT(SUM(net_amount), 2)"), "totalRevenue"],
        [db.Sequelize.literal("FORMAT(SUM(amount), 2)"), "totalPayment"],
        [db.Sequelize.fn("COUNT", db.Sequelize.col("net_amount")), "totalOrders"],
        [db.Sequelize.col("influencers.id"), "influencerId"],
        [db.Sequelize.col("influencers.name"), "influencerName"],
        [db.Sequelize.col("influencers.coupon_code"), "couponCode"],
        [db.Sequelize.col("influencers->influencer_persons.id"), "influencerPersonId"],
        [db.Sequelize.col("influencers->influencer_persons.name"), "influencerPersonName"],
      ],
      group: ["influencers.id", "influencers->influencer_persons.id"],
      raw: true,
    });

    res.status(200).send({ paymentWithCoupons });
  } catch (error) {
    console.error("Error getting influencer orders:", error);
    res.status(500).json({ error: "Failed to get influencer orders" });
  }
};

exports.getInfluencerOrders = async function (req, res) {
  const { influencer = "all", from, to } = req.query;

  // Define where conditions for payment and influencer
  const paymentWhere = {};
  let dynamicThrough = {};

  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Check if both dates are the same (YYYY-MM-DD)
    const isSameDay = fromDate.toDateString() === toDate.toDateString();

    if (isSameDay) {
      // Extend toDate to end of day
      toDate.setHours(23, 59, 59, 999);
    }

    paymentWhere.createdAt = {
      [Op.between]: [fromDate, toDate],
    };
  } else if (from) {
    paymentWhere[db.Sequelize.literal("DATE(createdAt)")] = {
      [Op.gte]: from,
    };
  } else if (to) {
    paymentWhere[db.Sequelize.literal("DATE(createdAt)")] = {
      [Op.lte]: to,
    };
  }

  if (influencer !== "all") {
    dynamicThrough = {
      where: {
        influencer_id: influencer,
      },
    };
  }

  try {
    const paymentWithCoupons = await db.payment.findAll({
      attributes: ["id", "createdAt"],
      required: true,
      include: [
        {
          model: db.influencer,
          attributes: ["id", "coupon_code"],
          required: true,
          include: [
            {
              model: db.influencerPersons,
              attributes: ["id", "name"],
              required: true,
              through: dynamicThrough,
            },
          ],
        },
        {
          model: db.InfluencerCommisions,
          attributes: ["id", "commision_amount", "total_amount", "net_amount"],
          as: "commisions",
          required: true,
        },
        {
          model: db.course,
          attributes: ["name"],
          required: true,
        },
        {
          model: db.user,
          attributes: ["username"],
          as: "users",
          required: true,
        },
      ],
      where: paymentWhere,
    });

    res.status(200).send({ paymentWithCoupons });
  } catch (error) {
    console.error("Error getting influencer orders:", error);
    res.status(500).json({ error: "Failed to get influencer orders" });
  }
};

exports.getOrdersForInfluencer = async function (req, res) {
  const { from, to } = req.params;
  const { userDecodeId } = req;

  const addOneDay = (date) => {
    const result = new Date(date);
    result.setDate(result.getDate() + 1);
    return result;
  };

  // Define where conditions for payment and influencer
  const paymentWhere = {};

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

  try {
    const paymentWithCoupons = await db.payment.findAll({
      attributes: ["id"],
      required: true,
      include: [
        {
          model: db.influencer,
          attributes: ["id", "coupon_code"],
          required: true,
          include: [
            {
              model: db.influencerPersons,
              attributes: ["id", "name"],
              required: true,
              through: {
                where: {
                  influencer_id: userDecodeId,
                },
              },
            },
          ],
        },
        {
          model: db.InfluencerCommisions,
          attributes: ["id", "commision_amount", "total_amount", "net_amount"],
          as: "commisions",
          required: true,
        },
        {
          model: db.course,
          attributes: ["name"],
          required: true,
        },
        {
          model: db.user,
          attributes: ["username"],
          as: "users",
          required: true,
        },
      ],
      where: paymentWhere,
    });

    res.status(200).send({ paymentWithCoupons });
  } catch (error) {
    console.error("Error getting influencer orders:", error);
    res.status(500).json({ error: "Failed to get influencer orders" });
  }
};

exports.getCouponReportDataForInfluencer = async function (req, res) {
  try {
    const { userDecodeId } = req;

    const orderCounts = await db.sequelize.query(
      `SELECT 
    c.id AS coupon_id,
    c.coupon_code AS coupon_name,
    COUNT(ic.payment_id) AS total_uses,  -- Number of times the coupon was used
    SUM(ic.total_amount) AS total_sales, -- Total sales generated using this coupon
    SUM(ic.commision_amount) AS total_commission, -- Total commission given for this coupon
    SUM(ic.net_amount) AS total_net_amount -- Total net amount after deductions
FROM influencer_commisions ic
JOIN influencers c ON ic.coupon_id = c.id
WHERE ic.influencer_id = :influencerId
GROUP BY c.id, c.coupon_code;`,
      {
        type: db.sequelize.QueryTypes.SELECT,
        replacements: { influencerId: userDecodeId },
      }
    );

    res.status(200).send({ orderCounts });
  } catch (error) {
    console.error("Error getting influencer report data:", error);
    res.status(500).json({ error: "Failed to get influencer report data" });
  }
};

exports.getCommisionReportDataForInfluencer = async function (req, res) {
  try {
    const { userDecodeId } = req;
    const { coupon = "all", from, to } = req.query;
    let influencerCommisionWhere = {
      influencer_id: userDecodeId,
    };

    if (coupon !== "all") {
      influencerCommisionWhere.coupon_id = coupon;
    }

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      // Extend toDate to end of day
      toDate.setHours(23, 59, 59, 999);

      influencerCommisionWhere.createdAt = {
        [Op.between]: [fromDate, toDate],
      };
    }

    const paymentWhere = {};
    let dynamicThrough = {};

    // const commisionsData = await db.InfluencerCommisions.findAll({
    //   attributes: ["id", "commision_amount", "influencer_id", "coupon_id", "createdAt"],
    //   required: true,
    //   where: influencerCommisionWhere,
    //   include: [
    //     {
    //       model: db.influencer,
    //       attributes: ["id", "coupon_code"],
    //       as: "influencer",
    //       required: true,
    //       include: [
    //         {
    //           model: db.influencerPersons,
    //           attributes: ["id", "name"],
    //           required: true,
    //           through: {
    //             attributes: [],
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       model: db.payment,
    //       as: "payment",
    //       attributes: ["id", "createdAt", "courseId"],
    //       required: true,
    //       include: [
    //         {
    //           model: db.course,
    //           attributes: ["name"],
    //           required: true,
    //         },
    //         {
    //           model: db.user,
    //           attributes: ["username"],
    //           as: "users",
    //           required: true,
    //         },
    //       ],
    //     },
    //   ],
    //   group: [
    //     "influencer_commisions.id",
    //     "influencer.id",
    //     "influencer->influencer_persons.id",
    //     "payment.id",
    //     "payment->course.id",
    //     "payment->users.id",
    //   ],
    // });

    console.log("isToToday", influencerCommisionWhere);

    const commisionsData = await db.payment.findAll({
      attributes: ["id", "createdAt"],
      required: true,
      include: [
        {
          model: db.influencer,
          attributes: ["id", "coupon_code"],
          required: true,
          include: [
            {
              model: db.influencerPersons,
              attributes: ["id", "name"],
              required: true,
              through: dynamicThrough,
            },
          ],
        },
        {
          model: db.InfluencerCommisions,
          attributes: ["id", "commision_amount", "total_amount", "net_amount"],
          as: "commisions",
          required: true,
          where: influencerCommisionWhere,
        },
        {
          model: db.course,
          attributes: ["name"],
          required: true,
        },
        {
          model: db.user,
          attributes: ["username"],
          as: "users",
          required: true,
        },
      ],
    });

    res.status(200).send({ commisionsData });
  } catch (error) {
    console.error("Error getting influencer report data:", error);
    res.status(500).json({ error: "Failed to get influencer report data" });
  }
};
