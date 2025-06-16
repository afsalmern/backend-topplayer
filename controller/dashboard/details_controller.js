const { Sequelize, where } = require("sequelize");
const db = require("../../models");
const { getOrders, getPayments, getEnrolledUsersPerCourse, combinePaymentData, getTamaraOrders } = require("../../utils/Revenue_helpers");

exports.getDashboardDetails = async (req, res) => {
  try {
    // Query to get count of expired , active and total orders
    const [commonCombos] = await db.sequelize.query(`
      SELECT rc.userId, rc.courseId, rc.createdAt, c.duration,c.isDeleted
      FROM registered_courses rc
      INNER JOIN payments p
      ON rc.userId = p.userId AND rc.courseId = p.courseId
      INNER JOIN courses c
      ON rc.courseId = c.id
      WHERE c.isDeleted = false
    `);

    const currentDate = new Date();
    const expiredCourses = [];
    const notExpiredCourses = [];

    commonCombos.forEach((registeredCourse) => {
      const startDate = new Date(registeredCourse.createdAt);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + registeredCourse.duration);

      if (currentDate > endDate) {
        expiredCourses.push(registeredCourse);
      } else {
        notExpiredCourses.push(registeredCourse);
      }
    });

    // Query to get count of paid users
    const [paidUsers] = await db.sequelize.query(`
      SELECT COUNT(DISTINCT rc.userId) AS paidUsers,c.isDeleted
      FROM registered_courses rc
      INNER JOIN courses c ON rc.courseId = c.id
      INNER JOIN payments p
      ON rc.userId = p.userId AND rc.courseId = p.courseId
      WHERE c.isDeleted = false
    `);

    // Query to get count of free users
    const [freeUsers] = await db.sequelize.query(`
     SELECT COUNT(DISTINCT rc.userId) AS freeUsers
    FROM registered_courses rc
    INNER JOIN courses c ON rc.courseId = c.id
    LEFT JOIN payments p ON rc.userId = p.userId AND rc.courseId = p.courseId
    WHERE p.userId IS NULL AND c.isDeleted = false
      `);

    // Count the number of free and paid users
    const freeUsersCount = freeUsers[0].freeUsers;
    const paidUsersCount = paidUsers[0].paidUsers;

    // Query to get count of total users
    const totalUsers = await db.user.count();
    // Query to get count of registered users
    const registeredUsersCount = await db.user.count({
      where: {
        id: {
          [Sequelize.Op.notIn]: Sequelize.literal(`(SELECT userId FROM registered_courses)`),
        },
      },
    });

    const allCourses = await db.course.findAll({
      where: {
        isDeleted: false,
      },
    });

    // Query to get count of paid users in each course
    const enrolledUsersPerCourse = await db.payment.findAll({
      attributes: ["courseId", [Sequelize.fn("COUNT", Sequelize.literal("userId")), "enrolled_users"]],
      include: [
        {
          model: db.course,
          attributes: ["name", "isDeleted"],
          as: "course",
          where: { isDeleted: false },
        },
      ],
      where: {
        userId: { [Sequelize.Op.not]: null },
      },
      group: ["courseId"],
    });

    const enrolledUsersMap = new Map();

    // Populate enrolledUsersMap with Sequelize results
    enrolledUsersPerCourse.forEach((course) => {
      const dataValues = course.dataValues;
      const courseId = dataValues.courseId;
      const enrolled_users = dataValues.enrolled_users == 0 ? 0 : dataValues.enrolled_users; // Access enrolled_users using get() method
      enrolledUsersMap.set(courseId, enrolled_users);
    });

    // Iterate over allCourses and add enrolled_users from enrolledUsersMap
    const coursesWithEnrollment = allCourses.map((course) => {
      const courseId = course.id;
      const enrolled_users = enrolledUsersMap.get(courseId) || 0; // Default to 0 if no enrolled_users found
      return {
        courseId: course.id,
        name: course.name,
        isDeleted: course.isDeleted,
        enrolled_users: enrolled_users,
      };
    });

    // Query to get count of monthly revenue
    const monthlyPaymentCounts = await db.payment.findAll({
      include: [
        {
          model: db.course,
          attributes: [],
          as: "course",
          where: { isDeleted: false },
        },
      ],
      attributes: [
        [Sequelize.fn("YEAR", Sequelize.col("payment.createdAt")), "year"],
        [Sequelize.fn("MONTH", Sequelize.col("payment.createdAt")), "month"],
        [Sequelize.fn("COUNT", Sequelize.col("*")), "payment_count"],
        [Sequelize.fn("ROUND", Sequelize.fn("SUM", Sequelize.col("payment.amount")), 2), "total_amount"],
      ],
      where: {
        userId: { [Sequelize.Op.not]: null },
      },
      group: [[Sequelize.fn("YEAR", Sequelize.col("payment.createdAt"))], [Sequelize.fn("MONTH", Sequelize.col("payment.createdAt"))]],
      order: [
        [Sequelize.fn("YEAR", Sequelize.col("payment.createdAt")), "ASC"],
        [Sequelize.fn("MONTH", Sequelize.col("payment.createdAt")), "ASC"],
      ],
    });

    // Query to get count of recent users
    const recentUsers = await db.user.findAll({
      order: [["createdAt", "DESC"]],
      limit: 10,
      attributes: ["username", "email", "mobile", "createdAt"],
      include: [
        {
          model: db.payment,
          attributes: ["id"],
        },
        {
          model: db.registeredCourse,
          attributes: ["id"],
          include: [
            {
              model: db.course,
              as: "course",
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    // Query to get count visitors
    const visitors = await db.visitors.findAll({
      attributes: [
        [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "year"],
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("COUNT", "*"), "visitors"],
        [Sequelize.literal("(SELECT COUNT(*) FROM visitors)"), "totalVisitors"],
      ],
      group: [Sequelize.fn("YEAR", Sequelize.col("createdAt")), Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
    });

    const totatlVisitors = visitors.length > 0 ? visitors[0].totalVisitors : 0;

    // Send the counts in the response
    res.status(200).json({
      activeUsersCount: paidUsersCount,
      totalUsers,
      freeUsersCount,
      registeredUsersCount,
      monthlyPaymentCounts,
      enrolledUsersPerCourse: coursesWithEnrollment,
      recentUsers,
      visitors,
      totatlVisitors,
      activeOrders: notExpiredCourses.length,
      expiredOrders: expiredCourses.length,
    });
  } catch (error) {
    console.error(`Error in getting dashboard details: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { filter, from, to } = req.query;
    // let maxFromDate = "2024-06-15";
    // const where = {};

    // if (from !== undefined) {
    //   if (from < maxFromDate) {
    //     return res.status(500).json({ message: "Invalid date provided" });
    //   }
    // }

    // if (from === undefined) {
    //   where.createdAt = {
    //     [Sequelize.Op.gte]: new Date(maxFromDate).toISOString(),
    //   };
    // } else if (from >= maxFromDate) {
    //   where.createdAt = {
    //     [Sequelize.Op.gte]: new Date(from).toISOString(),
    //   };
    // }

    // if (to !== undefined) {
    //   console.log("HERE");
    //   where.createdAt = {
    //     [Sequelize.Op.between]: [new Date(from).toISOString(), new Date(new Date(to).setDate(new Date(to).getDate() + 1)).toISOString()],
    //   };
    // }

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      // Extend toDate to end of day
      toDate.setHours(23, 59, 59, 999);

      where.createdAt = {
       [Sequelize.Op.between]: [fromDate, toDate],
      };
    }

    let whereClause = { isDeleted: false };

    if (filter == "camp") {
      whereClause = { iscamp: true, isDeleted: false };
    } else if (filter == "course") {
      whereClause = { iscamp: false, isDeleted: false };
    }

    const numberOfOrders = await db.payment.count({
      where,
      col: "id",
      include: [
        {
          model: db.course,
          include: {
            model: db.category,
            where: whereClause,
          },
        },
      ],
      logging: console.log, // 👈 This logs the raw SQL to the console
    });

    
    const orders = await getOrders(where, whereClause);

    const payments = await getPayments(where, whereClause);

    const enrolledUsersPerCourse = await getEnrolledUsersPerCourse(where, whereClause);

    const totalIncome = payments.reduce((acc, payment) => {
      return acc + (payment.totalIncome || 0);
    }, 0);

    const totalRevenue = payments.reduce((acc, payment) => {
      return acc + (payment.totalRevenue || 0);
    }, 0);

    res.status(200).json({
      payments,
      enrolledUsersPerCourse,
      totals: {
        totalIncome,
        totalRevenue,
        numberOfOrders,
      },
      orders,
    });
  } catch (error) {
    console.error(`Error in getting dashboard details: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOrdersUsd = async (req, res) => {
  try {
    const { filter, from, to } = req.query;
    let maxToDate = "2024-06-15";
    const where = {};

    if (to !== undefined) {
      if (to > maxToDate) {
        return res.status(500).json({ message: "Invalid date provided" });
      }
    }

    if (to === undefined) {
      where.createdAt = {
        [Sequelize.Op.lte]: new Date(maxToDate).toISOString(),
      };
    } else if (to >= maxToDate) {
      where.createdAt = {
        [Sequelize.Op.lte]: new Date(to).toISOString(),
      };
    }
    console.log("WHERE", where);
    console.log("DATES>>>>", from, to);

    if (from !== undefined) {
      where.createdAt = {
        [Sequelize.Op.between]: [new Date(from).toISOString(), new Date(new Date(to).setDate(new Date(to).getDate() + 1)).toISOString()],
      };
    }

    let whereClause = { isDeleted: false };

    if (filter == "camp") {
      whereClause = { iscamp: true, isDeleted: false };
    } else if (filter == "course") {
      whereClause = { iscamp: false, isDeleted: false };
    }

    const payments = await db.payment.findAll({
      where: where,
      include: [
        {
          model: db.course,
          attributes: ["name"],
          include: [
            {
              model: db.category,
              where: whereClause,
              attributes: [],
            },
          ],
          where: {
            id: { [Sequelize.Op.not]: null }, // Ensure the course is not null
          },
          required: true, // This ensures that only payments with a course are included
        },
      ],
      attributes: [
        "courseId",
        [Sequelize.fn("ROUND", Sequelize.literal("SUM(payment.amount)"), 2), "totalIncome"],
        [Sequelize.fn("COUNT", Sequelize.col("payment.id")), "numberOfOrders"],
      ],
      group: ["courseId"],
    });

    const enrolledUsersPerCourse = await db.payment.findAll({
      where: where,
      attributes: [
        "courseId",
        [Sequelize.fn("ROUND", Sequelize.literal("SUM(payment.amount)"), 2), "revenue"],
        [Sequelize.fn("COUNT", Sequelize.literal("payment.id")), "orders"],
      ],
      include: [
        {
          model: db.course,
          attributes: ["name"],
          as: "course",
          include: [
            {
              model: db.category,
              where: whereClause,
              attributes: [],
            },
          ],
          where: {
            id: { [Sequelize.Op.not]: null }, // Ensure the course is not null
          },
          required: true, // This ensures that only payments with a course are included
        },
      ],
      group: ["courseId"],
    });

    let orders = await db.payment.findAll({
      where: where,
      include: [
        {
          model: db.course,
          as: "course",
          attributes: ["id", "name", "amount", "offerAmount", "duration", "isDeleted"], // Include 'duration' attribute
          include: {
            model: db.category,
            attributes: ["id", "name", "iscamp"],
            where: whereClause,
          },
          required: true,
        },
        {
          model: db.user,
          as: "users",
          attributes: ["id", "username", "email"],
          required: true,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formattedOrders = orders.map((order) => ({
      amount: order.amount,
      net_amount: order.net_amount,
      stripe_fee: order.stripe_fee,
      stripeId: order.stripeId,
      createdAt: order.createdAt,
      course: order.course.name,
      amount_paid: order.course.offerAmount,
      category: order.course.category.name,
      user_name: order.users.username,
      email: order.users.email,
      mobile: order?.users?.mobile,
    }));

    const formattedItems = payments.map((payment) => ({
      program: payment.course.name,
      total_income: payment.getDataValue("totalIncome"),
      total_revenue: payment.getDataValue("totalRevenue"),
      number_of_orders: payment.getDataValue("numberOfOrders"),
    }));

    const numberOfOrders = formattedOrders.length;
    const totalIncome = payments.reduce((acc, payment) => {
      return acc + (payment.getDataValue("totalIncome") || 0);
    }, 0);

    res.status(200).json({
      payments: formattedItems,
      enrolledUsersPerCourse,
      totals: {
        totalIncome,
        numberOfOrders,
      },
      orders: formattedOrders,
    });
  } catch (error) {
    console.error(`Error in getting dashboard details: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getPayoutDetails = async (req, res) => {
  const { id: influencer = "all", start, end } = req.query;

  try {
    let replacements = [];
    let whereConditions = [];

    let query = `
      SELECT 
        ip.id AS influencer_id,
        ip.name AS influencer_name,
        ip.email AS influencer_email,
        ip.phone AS influencer_phone,
        SUM(c.commision_amount) AS total_commission,
        MIN(c.createdAt) AS commission_start_date,
        MAX(c.createdAt) AS commission_end_date
      FROM influencer_commisions c
      JOIN influencer_persons ip ON c.influencer_id = ip.id
    `;

    // Dynamic WHERE conditions
    if (influencer !== "all") {
      whereConditions.push("c.influencer_id = ?");
      replacements.push(influencer);
    }

    if (start && end) {
      const fromDate = new Date(start);
      let toDate = new Date(end);

      if (start === end) {
        toDate.setHours(23, 59, 59, 999);
        fromDate.setHours(0, 0, 0, 0);
      }

      whereConditions.push("c.createdAt BETWEEN ? AND ?");
      replacements.push(fromDate, toDate);
    }

    if (whereConditions.length > 0) {
      query += " WHERE " + whereConditions.join(" AND ");
    }

    query += `
      GROUP BY ip.id, ip.name, ip.email, ip.phone
      ORDER BY total_commission DESC
    `;

    console.log("Executing SQL:", query, replacements);

    const payoutDetails = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
      replacements,
    });

    const totalCommisions = await db.Payouts.sum("amount", {
      where: influencer !== "all" ? { influencer_id: influencer } : {},
    });

    res.status(200).json({ payoutDetails, totalCommisions });
  } catch (error) {
    console.error(`Error in getting payout details: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
