const { Sequelize, where } = require("sequelize");
const db = require("../../models");

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
          [Sequelize.Op.notIn]: Sequelize.literal(
            `(SELECT userId FROM registered_courses)`
          ),
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
      attributes: [
        "courseId",
        [Sequelize.fn("COUNT", Sequelize.literal("userId")), "enrolled_users"],
      ],
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
      const enrolled_users =
        dataValues.enrolled_users == 0 ? 0 : dataValues.enrolled_users; // Access enrolled_users using get() method
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
        [
          Sequelize.fn(
            "ROUND",
            Sequelize.fn("SUM", Sequelize.col("payment.amount")),
            2
          ),
          "total_amount",
        ],
      ],
      where: {
        userId: { [Sequelize.Op.not]: null },
      },
      group: [
        [Sequelize.fn("YEAR", Sequelize.col("payment.createdAt"))],
        [Sequelize.fn("MONTH", Sequelize.col("payment.createdAt"))],
      ],
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
      group: [
        Sequelize.fn("YEAR", Sequelize.col("createdAt")),
        Sequelize.fn("MONTH", Sequelize.col("createdAt")),
      ],
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
    const { filter, from, to } = req.params;
    let maxFromDate = "2024-06-15";
    const where = {};

    if (from !== undefined) {
      if (from < maxFromDate) {
        return res.status(500).json({ message: "Invalid date provided" });
      }
    }

    if (from === undefined) {
      where.createdAt = {
        [Sequelize.Op.gte]: new Date(maxFromDate).toISOString(),
      };
    } else if (from >= maxFromDate) {
      where.createdAt = {
        [Sequelize.Op.gte]: new Date(from).toISOString(),
      };
    }

    if (to !== undefined) {
      console.log("HERE");
      where.createdAt = {
        [Sequelize.Op.between]: [
          new Date(from).toISOString(),
          new Date(
            new Date(to).setDate(new Date(to).getDate() + 1)
          ).toISOString(),
        ],
      };
    }

    let whereClause = { isDeleted: false };

    if (filter == "camp") {
      whereClause = { iscamp: true, isDeleted: false };
    } else if (filter == "course") {
      whereClause = { iscamp: false, isDeleted: false };
    }

    const orders = await db.payment.findAll({
      where: where,
      attributes: ["stripe_fee", "net_amount", "createdAt"],
      include: [
        {
          model: db.course,
          attributes: ["name", "offerAmount"],
          include: {
            model: db.category,
            where: whereClause,
            attributes: ["name"],
          },
          required: false, // Allow courses that have no associated category
        },
        {
          model: db.user,
          as: "users",
          attributes: ["username", "email", "mobile"],
          required: false, // Allow payments that have no associated user
        },
      ],
    });

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
            id: { [Sequelize.Op.not]: null },
            isDeleted: false, // Ensure the course is not null
          },
          required: true, // This ensures that only payments with a course are included
        },
      ],
      attributes: [
        "courseId",
        [
          Sequelize.fn(
            "ROUND",
            Sequelize.literal("SUM(payment.net_amount)"),
            2
          ),
          "totalIncome",
        ],
        [
          Sequelize.fn("ROUND", Sequelize.literal("SUM(payment.amount)"), 2),
          "totalRevenue",
        ],
        [Sequelize.fn("COUNT", Sequelize.col("payment.id")), "numberOfOrders"],
      ],
      group: ["courseId"],
    });

    const enrolledUsersPerCourse = await db.payment.findAll({
      where: where,
      attributes: [
        "courseId",
        [
          Sequelize.fn(
            "ROUND",
            Sequelize.literal("SUM(payment.net_amount)"),
            2
          ),
          "revenue",
        ],
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
            id: { [Sequelize.Op.not]: null },
            isDeleted: false, // Ensure the course is not null
          },
          required: true, // This ensures that only payments with a course are included
        },
      ],
      group: ["courseId"],
    });

    const totals = await db.payment.findAll({
      where: where,
      attributes: [
        [
          Sequelize.fn(
            "ROUND",
            Sequelize.literal("SUM(payment.net_amount)"),
            2
          ),
          "totalIncome",
        ],
        [
          Sequelize.fn("ROUND", Sequelize.literal("SUM(payment.amount)"), 2),
          "totalRevenue",
        ],
        [
          Sequelize.fn("COUNT", Sequelize.literal("payment.id")),
          "numberOfOrders",
        ],
      ],
    });

    const formattedItems = payments.map((payment) => ({
      program: payment.course ? payment.course.name : "Unknown",
      total_income: payment.getDataValue("totalIncome") || 0,
      total_revenue: payment.getDataValue("totalRevenue") || 0,
      number_of_orders: payment.getDataValue("numberOfOrders") || 0,
    }));

    const formattedOrders = orders.map((order) => ({
      stripe_fee: order.stripe_fee || 0,
      net_amount: order.net_amount || 0,
      createdAt: order.createdAt,
      course: order.course ? order.course.name : "Unknown",
      offerAmount: order.course ? order.course.offerAmount : 0,
      category:
        order.course && order.course.category
          ? order.course.category.name
          : "Unknown",
      user_name: order.user ? order.user.name : "Unknown",
      email: order.user ? order.user.email : "Unknown",
      mobile: order.user ? order.user.mobile : "Unknown",
    }));

    res.status(200).json({
      payments: formattedItems,
      enrolledUsersPerCourse,
      totals,
      formattedOrders,
    });
  } catch (error) {
    console.error(`Error in getting dashboard details: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOrdersUsd = async (req, res) => {
  try {
    const { filter, from, to } = req.params;
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
        [Sequelize.Op.between]: [
          new Date(from).toISOString(),
          new Date(
            new Date(to).setDate(new Date(to).getDate() + 1)
          ).toISOString(),
        ],
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
        [
          Sequelize.fn("ROUND", Sequelize.literal("SUM(payment.amount)"), 2),
          "totalIncome",
        ],
        [Sequelize.fn("COUNT", Sequelize.col("payment.id")), "numberOfOrders"],
      ],
      group: ["courseId"],
    });

    const enrolledUsersPerCourse = await db.payment.findAll({
      where: where,
      attributes: [
        "courseId",
        [
          Sequelize.fn("ROUND", Sequelize.literal("SUM(payment.amount)"), 2),
          "revenue",
        ],
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

    const totals = await db.payment.findAll({
      where: {
        createdAt: {
          [db.Sequelize.Op.lt]: new Date("2024-06-15"), // Filter by createdAt date
        },
      },
      attributes: [
        [
          Sequelize.fn("ROUND", Sequelize.literal("SUM(payment.amount)"), 2),
          "totalIncome",
        ],
        [
          Sequelize.fn("COUNT", Sequelize.literal("payment.id")),
          "numberOfOrders",
        ],
      ],
    });

    res.status(200).json({
      payments,
      enrolledUsersPerCourse,
      totals,
    });
  } catch (error) {
    console.error(`Error in getting dashboard details: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
