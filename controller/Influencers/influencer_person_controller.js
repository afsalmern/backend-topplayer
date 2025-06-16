const bcrypt = require("bcryptjs");
const db = require("../../models");
const generateRandomPassword = require("../../utils/generate_password");
const { passwordResetMailInfluencer, welcomeMailInfluencer } = require("../../utils/mail_content");
const sendMail = require("../../utils/mailer");
const {
  getCommissionBreakdowns,
  getCouponStats,
  getCouponSales,
  getOrderCounts,
  getSalesDataMonthly,
  getSalesDataWeekly,
  getSalesDataToday,
  getSalesDataCountyWise,
  getPayDetails,
  getCouponWiseData,
  getMonthlySales,
} = require("../../utils/influencer_dashboard_helpers");
const { generateLightColors } = require("../../utils/color_generator");
exports.addInfluencerPerson = async (req, res) => {
  const { name, phone, email, password, role } = req.body;
  const transaction = await db.sequelize.transaction();
  try {
    // Check if email or phone already exists in parallel
    const [existingEmail, existingPhone] = await Promise.all([
      db.influencerPersons.findOne({ where: { email, is_deleted: false } }),
      db.influencerPersons.findOne({ where: { phone, is_deleted: false } }),
    ]);

    if (existingEmail) return res.status(400).json({ message: "Email already in use" });
    if (existingPhone) return res.status(400).json({ message: "Phone number already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newInfluencerPerson = await db.influencerPersons.create(
      {
        name,
        phone,
        email,
        password: hashedPassword,
      },
      {
        transaction,
      }
    );

    const addToAdmin = await db.adminUser.create(
      {
        username: name,
        email,
        password: hashedPassword,
        role,
      },
      {
        transaction,
      }
    );

    const subject = "TheTopPlayer Influencer Onboard";
    const text = "Welcome influencer"; // plain text body
    const html = welcomeMailInfluencer(name, email, password);

    const isMailsend = await sendMail(email, subject, text, html);

    if (isMailsend) {
      console.log("Email sent:");
    } else {
      console.error("Error sending email:", error);
    }

    await transaction.commit();

    res.status(201).json({ message: "Influencer created successfully" });
  } catch (error) {
    console.error("Error creating influencer person:", error);
    await transaction.rollback();
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateInfluencerPerson = async (req, res) => {
  try {
    const { id, name, phone, email } = req.body;

    // Check if influencer exists
    const influencerPerson = await db.influencerPersons.findByPk(id);
    if (!influencerPerson) return res.status(404).json({ message: "Influencer person not found" });

    // Check if email or phone is already taken (excluding current record)
    const [existingEmail, existingPhone] = await Promise.all([
      db.influencerPersons.findOne({ where: { email, id: { [db.Sequelize.Op.ne]: id } } }),
      db.influencerPersons.findOne({ where: { phone, id: { [db.Sequelize.Op.ne]: id } } }),
    ]);

    if (existingEmail) return res.status(400).json({ message: "Email already in use" });
    if (existingPhone) return res.status(400).json({ message: "Phone number already in use" });

    // Update influencer person
    await influencerPerson.update({
      name,
      phone,
      email,
    });

    res.status(200).json({ message: "Influencer updated successfully" });
  } catch (error) {
    console.error("Error updating influencer person:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateInfluencerPersonStatus = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL
    const { is_active } = req.body;

    // Check if influencer exists
    const influencerPerson = await db.influencerPersons.findByPk(id);
    if (!influencerPerson) return res.status(404).json({ message: "Influencer not found" });

    // Update influencer person
    await influencerPerson.update({
      status: is_active ? "active" : "blocked",
    });

    res.status(200).json({ message: "Influencer updated successfully" });
  } catch (error) {
    console.error("Error updating influencer person:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getInfluencerPerson = async (req, res) => {
  try {
    const { id } = req.params;

    const influencerPerson = await db.influencerPersons.findByPk(id, {
      attributes: ["id", "name", "phone", "email"], // Exclude password for security
    });

    if (!influencerPerson) return res.status(404).json({ message: "Influencer person not found" });

    res.status(200).json(influencerPerson);
  } catch (error) {
    console.error("Error fetching influencer person:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getCouponsForInfluncers = async (req, res) => {
  const { id: influencer_id } = req.params;
  try {
    const influencer = await db.influencerPersons.findByPk(influencer_id, {
      attributes: ["id", "name", "email", "phone"],
      where: { is_deleted: false },
    });
    if (!influencer) return res.status(404).json({ message: "Influencer person not found" });

    const couponDetails = await db.influencerPersons.findByPk(influencer_id, {
      attributes: ["id"],
      include: [
        {
          model: db.influencer,
          where: { is_deleted: false },
          through: {
            attributes: [],
          },
        },
      ],
    });

    res.status(200).json({ couponDetails, influencer });
  } catch (error) {
    console.error("Error gettiing influencer coupons:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllInfluencerPersons = async (req, res) => {
  try {
    const influencerPersons = await db.influencerPersons.findAll({
      attributes: ["id", "name", "phone", "email", "status"],
      where: { is_deleted: false },
      include: [
        {
          model: db.influencer,
          attributes: ["id", "coupon_code"],
          through: {
            attributes: [],
          },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(influencerPersons);
  } catch (error) {
    console.error("Error fetching influencer persons:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteInfluencerPerson = async (req, res) => {
  try {
    const { id } = req.params;

    const influencerPerson = await db.influencerPersons.findByPk(id);
    if (!influencerPerson) return res.status(404).json({ message: "Influencer person not found" });

    const adminUser = await db.adminUser.findOne({ where: { email: influencerPerson.email } });
    if (adminUser) await adminUser.destroy();

    // await influencerPerson.destroy();
    await influencerPerson.update({ is_deleted: true });

    res.status(200).json({ message: "Influencer deleted successfully" });
  } catch (error) {
    console.error("Error deleting influencer person:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateInfluencerPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const influencerPerson = await db.influencerPersons.findOne({
      where: { email },
    });
    if (!influencerPerson) return res.status(404).json({ message: "Influencer person not found" });

    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(password);
    console.log(hashedPassword);

    const affectedRows = await influencerPerson.update({ password: hashedPassword });

    if (affectedRows === 0) {
      return res.status(500).json({ message: "Failed to update password" });
    }

    const adminUser = await db.adminUser.findOne({ where: { email: influencerPerson.email } });
    console.log(adminUser);
    if (adminUser) {
      await adminUser.update({
        password: hashedPassword,
      });
    }

    const subject = "TheTopPlayer Influencer Password Reset";
    const text = "Password Reset"; // plain text body
    const html = passwordResetMailInfluencer(influencerPerson.name, password);

    const isMailsend = await sendMail(email, subject, text, html);
    if (isMailsend) {
      console.log("Email sent:");
      res.status(200).send({
        message: "Please check your email to Reset your pass",
      });
    } else {
      console.error("Error sending email:", error);
      res.status(500).send({
        message: "Your email address couldn't be found or is unable to receive email. please check your email and try again.",
      });
    }
  } catch (error) {
    console.error("Error deleting influencer person:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getDashboardDataForInfluencers = async (req, res) => {
  const { userDecodeId } = req;

  try {
    const couponStats = await getCouponStats(userDecodeId);

    const couponSales = await getCouponSales(userDecodeId);

    const commisionData = await getCommissionBreakdowns(userDecodeId);

    const orderCounts = await getOrderCounts(userDecodeId);

    const countryWiseData = await getSalesDataCountyWise(userDecodeId);

    const payDetails = await getPayDetails(userDecodeId);

    // const couponWiseData = await getCouponWiseData(userDecodeId);

    // const monthlySales = await getMonthlySales(userDecodeId);

    if (payDetails.length === 0) {
      return res.status(200).json({
        couponStats,
        couponSales,
        commisionData,
        orderCounts,
        cardData: {
          total: 0,
          received: 0,
          to_receive: 0,
        },
        countryWiseData: [],
        years: [],
      });
    }

    const { commission_received, commission_total, commission_total_details, commission_recieved_details } = payDetails[0];

    const total = Math.round(Number(commission_total) * 100) / 100;
    const received = Math.round(Number(commission_received) * 100) / 100;
    const to_receive = Math.round((Number(commission_total) - Number(commission_received)) * 100) / 100;

    const currentYear = new Date().getFullYear();
    const years = [];

    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
      years.push(i);
    }

    const colors = generateLightColors(years.length);

    return res.status(200).json({
      couponStats,
      couponSales,
      commisionData,
      orderCounts,
      cardData: {
        total,
        received,
        to_receive,
        commission_total_details:
          commission_total_details?.length == 1 ? [commission_total_details[0], commission_total_details[0]] : commission_total_details,
        commission_recieved_details:
          commission_recieved_details?.length == 1 ? [commission_recieved_details[0], commission_recieved_details[0]] : commission_recieved_details,
        commission_pending_details: [to_receive, to_receive],
      },
      countryWiseData: countryWiseData[0]?.result || [],
      years,
      colors,
    });
  } catch (error) {
    console.error("Error getting dashboard data for influencers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getSalesDataForInfluencers = async (req, res) => {
  const { userDecodeId } = req;
  const { filter_type } = req.query;

  let salesData = [];

  try {
    switch (filter_type) {
      case "today":
        const dailyData = await getSalesDataToday(userDecodeId);
        salesData = dailyData[0]?.today;
        break;
      case "weekly":
        const weeklyData = await getSalesDataWeekly(userDecodeId);
        salesData = weeklyData[0]?.weekly;
        break;
      case "monthly":
        salesData = await getSalesDataMonthly(userDecodeId);
        break;
      default:
        return [];
    }

    return res.status(200).json({
      salesData,
    });
  } catch (error) {
    console.error("Error getting dashboard data for influencers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getCouponPerformance = async (req, res) => {
  try {
    const couponWiseData = await db.sequelize.query(
      `SELECT 
      c.id AS coupon_id,
      c.coupon_code AS coupon_name,
      COUNT(ic.payment_id) AS total_uses,  -- Number of times the coupon was used
      SUM(ic.total_amount) AS total_sales, -- Total sales generated using this coupon
      SUM(ic.commision_amount) AS total_commission, -- Total commission given for this coupon
      SUM(ic.net_amount) AS total_net_amount -- Total net amount after deductions
  FROM influencer_commisions ic
  JOIN influencers c ON ic.coupon_id = c.id
  GROUP BY c.id, c.coupon_code;`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const coupons = await db.influencer.findAll({
      attributes: ["id", "coupon_code"],
      include: [
        {
          model: db.influencerPersons,
          attributes: ["id", "status"],
          where: { status: "active" },
          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.status(200).json({
      couponWiseData,
      coupons,
    });
  } catch (error) {
    console.error("Error getting dashboard data for influencers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getCouponBreakDowns = async function (req, res) {
  try {
    const { coupon = "all", from, to } = req.query;
    const paymentWhere = [];
    const replacements = {};

    console.log("FILTER", req.query);

    const addOneDay = (date) => {
      const result = new Date(date);
      result.setDate(result.getDate() + 1);
      return result;
    };

    // Apply filters to the WHERE clause
    if (from && to) {
      paymentWhere.push(`ic.createdAt BETWEEN :fromDate AND :toDate`);
      replacements.fromDate = new Date(from);
      replacements.toDate = addOneDay(new Date(to));
    } else if (from) {
      paymentWhere.push(`ic.createdAt >= :fromDate`);
      replacements.fromDate = new Date(from);
    } else if (to) {
      paymentWhere.push(`ic.createdAt <= :toDate`);
      replacements.toDate = new Date(to);
    }

    // Apply coupon filter if it's not "all"
    if (coupon != "all") {
      paymentWhere.push(`ic.coupon_id = :couponId`);
      replacements.couponId = coupon;
    }

    // Construct the WHERE clause dynamically
    const whereClause = paymentWhere.length ? `WHERE ${paymentWhere.join(" AND ")}` : "";

    console.log("FILTER", whereClause);
    console.log("FILTER", paymentWhere);

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
      ${whereClause}  -- Dynamic filters applied
      GROUP BY c.id, c.coupon_code;`,
      {
        type: db.sequelize.QueryTypes.SELECT,
        replacements, // Pass the parameters dynamically
      }
    );

    res.status(200).send({ orderCounts });
  } catch (error) {
    console.error("Error getting influencer report data:", error);
    res.status(500).json({ error: "Failed to get influencer report data" });
  }
};
