const e = require("express");
const { Sequelize } = require("../models");
const { generateLightColors } = require("../utils/color_generator");

const getCardData = async () => {
  try {
    const totalUsers = (await db.user.count())?.toString();
    // const totalOrders = (await db.payment.count())?.toString();
    const numberOfOrders = await db.payment.count({

      distinct: true,
      col: 'id',
      include: [
        {
          model: db.course,
          include: {
            model: db.category,
          },
          required: true,
        },
        {
          model: db.user,
          as: "users",
          required: true,
        },
      ],
    });
    const totalVisitors = (await db.visitors.count())?.toString();
    const totalSales = (await db.payment.sum("net_amount"))?.toFixed(2) || "0";

    return {
      totalUsers,
      totalOrders: numberOfOrders?.toString(),
      totalVisitors,
      totalSales,
    };
  } catch (error) {
    console.error(`Error in getting dashboard details - Card data: ${error}`);
    throw error;
  }
};

const getUserPieData = async () => {
  try {
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

    const registeredUsersCount = await db.user.count({
      where: {
        id: {
          [Sequelize.Op.notIn]: Sequelize.literal(`(SELECT userId FROM registered_courses)`),
        },
      },
    });

    // Count the number of free and paid users
    const freeUsersCount = freeUsers[0].freeUsers;
    const paidUsersCount = paidUsers[0].paidUsers;

    return {
      paid: paidUsersCount,
      free: freeUsersCount,
      registered: registeredUsersCount,
    };
  } catch (error) {
    console.error(`Error in getting dashboard details - User Pie data: ${error}`);
    throw error;
  }
};

const getOrdersPieData = async () => {
  try {
    const ordersData = await db.sequelize.query(
      `
          SELECT
  SUM(CASE WHEN CURRENT_DATE > DATE_ADD(rc.createdAt, INTERVAL c.duration MONTH) THEN 1 ELSE 0 END) AS expired,
  SUM(CASE WHEN CURRENT_DATE <= DATE_ADD(rc.createdAt, INTERVAL c.duration MONTH) THEN 1 ELSE 0 END) AS active
FROM registered_courses rc
INNER JOIN payments p
  ON rc.userId = p.userId AND rc.courseId = p.courseId
INNER JOIN courses c
  ON rc.courseId = c.id
WHERE c.isDeleted = false;`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const orders = {
      expired: Number(ordersData[0].expired),
      active: Number(ordersData[0].active),
    };

    return orders;
  } catch (error) {
    console.error(`Error in getting dashboard details - Order Pie data: ${error}`);
    throw error;
  }
};

const getEnrollDataPie = async () => {
  try {
    const allCourses = await db.course.findAll({
      attributes: ["id", "name", "isDeleted"],
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

    const labels = coursesWithEnrollment.map((course) => course.name);
    const series = coursesWithEnrollment.map((course) => course.enrolled_users);

    const pieChartColors = [
      "#FF6B4D", // Softer red-orange
      "#4DFF88", // Softer green
      "#4D6BFF", // Softer blue
      "#FF4DA8", // Softer pink
      "#FF9A4D", // Softer orange
      "#4DFFF2", // Softer cyan
      "#A64DFF", // Softer purple
      "#FFD24D", // Softer yellow
      "#4DFFC9", // Softer teal
      "#FF4D4D", // Softer red
    ];

    const colors = [];
    for (let i = 0; i < labels.length; i++) {
      colors.push(pieChartColors[i % pieChartColors.length]);
    }

    const legends = labels.map((label) => {
      return {
        name: label,
        color: colors[labels.indexOf(label)],
        value: series[labels.indexOf(label)],
      };
    });

    return {
      labels,
      series,
      colors,
      legends,
    };
  } catch (error) {
    console.error(`Error in getting dashboard details - Courses Pie data: ${error}`);
    throw error;
  }
};

const getSalesDataCountyWise = async (userDecodeId) => {
  try {
    const countryWiseData = await db.sequelize.query(
      `
   SELECT 
  YEAR(createdAt) AS year,
  country_name,
  ROUND(SUM(net_amount), 2) AS total_sales
FROM payments
WHERE country_name IS NOT NULL
  AND YEAR(createdAt) BETWEEN YEAR(CURDATE()) - 2 AND YEAR(CURDATE()) + 2
GROUP BY YEAR(createdAt), country_name
ORDER BY country_name, year;

`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const currentYear = new Date().getFullYear();
    const yearRange = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

    const countryMap = {};

    countryWiseData.forEach((row) => {
      if (!countryMap[row.country_name]) {
        countryMap[row.country_name] = { name: row.country_name, data: [0, 0, 0, 0, 0] };
      }
      const index = yearRange.indexOf(row.year);
      if (index !== -1) {
        countryMap[row.country_name].data[index] = row.total_sales;
      }
    });

    const result = Object.values(countryMap);

    const years = [];

    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
      years.push(i);
    }

    const colors = generateLightColors(years.length);

    return {
      countryWiseData: result,
      years,
      colors,
    };
  } catch (error) {
    console.log("Error getting daily data");
    throw error;
  }
};

const getInfluencerSales = async () => {
  try {
    const salesData = await db.sequelize.query(
      `
      SELECT 
  i.name AS influencer_name,
  ROUND(SUM(ic.net_amount), 2) AS total_sales
FROM influencer_commisions ic
JOIN influencer_persons i ON ic.influencer_id = i.id
GROUP BY ic.influencer_id, i.name
ORDER BY total_sales DESC;

      `,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const formattedSalesData = salesData.map((row) => ({
      ...row,
      total_sales: parseFloat(row.total_sales),
    }));

    const colors = generateLightColors(formattedSalesData.length);

    return {
      salesData: formattedSalesData,
      colors,
    };
  } catch (error) {
    console.log("Error getting influencer sales data", error);
    throw error;
  }
};

const getRecentOrders = async () => {
  try {
    const orders = await db.payment.findAll({
      attributes: ["stripe_fee", "net_amount", "createdAt", "amount", "fromTamara"],
      include: [
        {
          model: db.course,
          attributes: ["name", "offerAmount"],
          include: {
            model: db.category,
            attributes: ["name"],
          },
          required: true, // Allow courses that have no associated category
        },
        {
          model: db.user,
          as: "users",
          attributes: ["username", "email", "mobile"],
          required: true, // Allow payments that have no associated user
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    const formattedOrders = orders.map((order) => ({
      amountPaid: order.amount,
      netAmount: order.net_amount,
      stripeFee: order.stripe_fee,
      isTamara: order.fromTamara,
      course: order.course.name,
      courseAmount: order.course.offerAmount,
      category: order.course.category.name,
      user: order.users.username,
      email: order.users.email,
      mobile: order?.users?.mobile,
    }));

    return formattedOrders;
  } catch (error) {
    console.log("Error getting recent orders", error);
    throw error;
  }
};

const getCouponUses = async () => {
  try {
    const orderCounts = await db.sequelize.query(
      `SELECT 
            c.id AS coupon_id,
            c.coupon_code AS coupon_name,
            COUNT(ic.payment_id) AS total_uses, 
            SUM(ic.commision_amount) AS total_commission 
          FROM influencer_commisions ic
          JOIN influencers c ON ic.coupon_id = c.id
          GROUP BY c.id, c.coupon_code;`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    return orderCounts;
  } catch (error) {
    console.log("Error getting coupon uses", error);
    throw error;
  }
};

const getPaymentWiseData = async () => {
  try {
    const paymentWiseData = await db.sequelize.query(
      `
      SELECT 
  MONTH(createdAt) AS month,
  SUM(CASE WHEN fromTamara = 1 THEN 1 ELSE 0 END) AS tamara,
  SUM(CASE WHEN fromTamara = 0 THEN 1 ELSE 0 END) AS stripe
FROM payments
WHERE YEAR(createdAt) = YEAR(CURDATE())
GROUP BY MONTH(createdAt)
ORDER BY month;
      `,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const tamaraData = new Array(12).fill(0);
    const stripeData = new Array(12).fill(0);

    paymentWiseData.forEach((row) => {
      const index = row.month - 1;
      tamaraData[index] = parseFloat(row.tamara);
      stripeData[index] = parseFloat(row.stripe);
    });

    const series = [
      { name: "Tamara", data: tamaraData },
      { name: "Stripe", data: stripeData },
    ];

    const colors = generateLightColors(series.length);
    const legends = series.map((item) => ({
      name: item.name,
      color: colors[series.indexOf(item)],
    }));

    return {
      series,
      colors,
      legends,
    };
  } catch (error) {
    console.log("Error getting payment wise data", error);
    throw error;
  }
};

const getVisitorsData = async () => {
  try {
    const visitors = await db.sequelize.query(
      `
    SELECT
  COUNT(ip) AS visitors,
  MONTH(createdAt) AS month
FROM visitors
WHERE YEAR(createdAt) = YEAR(CURDATE())
GROUP BY MONTH(createdAt)
ORDER BY month;

      `,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const visitorData = new Array(12).fill(0);

    visitors.forEach((row) => {
      const index = row.month - 1;
      visitorData[index] = parseFloat(row.visitors);
    });

    return visitorData;
  } catch (error) {
    console.log("Error getting visitors data", error);
    throw error;
  }
};

const getMonthlyRevenuesAndOrders = async () => {
  try {
    const monthlyData = await db.sequelize.query(
      `
      WITH months AS (
    SELECT 1 as month_num, 'Jan' as month_name UNION ALL
    SELECT 2, 'Feb' UNION ALL
    SELECT 3, 'Mar' UNION ALL
    SELECT 4, 'Apr' UNION ALL
    SELECT 5, 'May' UNION ALL
    SELECT 6, 'Jun' UNION ALL
    SELECT 7, 'Jul' UNION ALL
    SELECT 8, 'Aug' UNION ALL
    SELECT 9, 'Sept' UNION ALL
    SELECT 10, 'Oct' UNION ALL
    SELECT 11, 'Nov' UNION ALL
    SELECT 12, 'Dec'
),
monthly_data AS ( SELECT 
    m.month_num,
    m.month_name,
    COALESCE(ROUND(SUM(ic.net_amount), 2), 0) AS revenues,
    COALESCE(COUNT(ic.id), 0) AS orders
FROM 
    months m
LEFT JOIN 
    payments ic ON MONTH(ic.createdAt) = m.month_num 
    AND YEAR(ic.createdAt) = YEAR(CURDATE())                        
GROUP BY 
    m.month_num, m.month_name
ORDER BY 
    m.month_num)

SELECT JSON_OBJECT (
'labels',JSON_ARRAYAGG(month_name),
'revenues',JSON_ARRAYAGG(revenues),
'orders',JSON_ARRAYAGG(orders)
) AS monthly
FROM monthly_data;`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    return monthlyData;
  } catch (error) {
    console.log("Error getting monthly revenues and orders", error);
    throw error;
  }
};

const getWeeklyRevenuesAndOrders = async () => {
  try {
    const weeklyData = await db.sequelize.query(
      `
               WITH weeks AS (
       SELECT 1 AS week_num UNION ALL
       SELECT 2 UNION ALL
       SELECT 3 UNION ALL
       SELECT 4 UNION ALL
       SELECT 5
   ),
   week_data AS (
       SELECT 
           CASE 
               WHEN DAY(p.createdAt) BETWEEN 1 AND 7 THEN 1
               WHEN DAY(p.createdAt) BETWEEN 8 AND 14 THEN 2
               WHEN DAY(p.createdAt) BETWEEN 15 AND 21 THEN 3
               WHEN DAY(p.createdAt) BETWEEN 22 AND 28 THEN 4
               ELSE 5
           END AS week_num,
          ROUND(SUM(p.net_amount), 2) AS revenue,
           COUNT(p.id) AS sales
       FROM payments p
       WHERE MONTH(p.createdAt) = MONTH(CURDATE())
           AND YEAR(p.createdAt) = YEAR(CURDATE())
       GROUP BY week_num
   ),
   max_week AS (
       SELECT 
           CASE 
               WHEN DAY(LAST_DAY(CURDATE())) <= 28 THEN 4
               ELSE 5
           END AS week_count
   ),
   combined AS (
       SELECT 
           w.week_num,
           COALESCE(wd.revenue, 0) AS revenue,
           COALESCE(wd.sales, 0) AS sales
       FROM weeks w
       JOIN max_week mw ON w.week_num <= mw.week_count
       LEFT JOIN week_data wd ON w.week_num = wd.week_num
       ORDER BY w.week_num
   )
   SELECT JSON_OBJECT(
       'labels', JSON_ARRAYAGG(CONCAT('week', week_num)),
       'revenue', JSON_ARRAYAGG(revenue),
       'orders', JSON_ARRAYAGG(sales)
   ) AS weekly
   FROM combined; `,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    return weeklyData;
  } catch (error) {
    console.log("Error getting monthly revenues and orders", error);
    throw error;
  }
};

const getDailyRevenuesAndOrders = async () => {
  try {
    const dailyData = await db.sequelize.query(
      `
     WITH hours AS (
  SELECT 0 AS hour_start UNION ALL
  SELECT 2 UNION ALL
  SELECT 4 UNION ALL
  SELECT 6 UNION ALL
  SELECT 8 UNION ALL
  SELECT 10 UNION ALL
  SELECT 12 UNION ALL
  SELECT 14 UNION ALL
  SELECT 16 UNION ALL
  SELECT 18 UNION ALL
  SELECT 20 UNION ALL
  SELECT 22
),
today_data AS (
  SELECT 
    FLOOR(HOUR(createdAt) / 2) * 2 AS hour_slot,
    ROUND(SUM(net_amount), 2) AS revenue,
    COUNT(id) AS sales
  FROM payments
  WHERE DATE(createdAt) = CURDATE()
  GROUP BY hour_slot
),
combined AS (
  SELECT 
    h.hour_start,
    COALESCE(td.revenue, 0) AS revenue,
    COALESCE(td.sales, 0) AS sales
  FROM hours h
  LEFT JOIN today_data td ON h.hour_start = td.hour_slot
  ORDER BY h.hour_start
)
SELECT JSON_OBJECT(
  'labels', JSON_ARRAYAGG(DATE_FORMAT(STR_TO_DATE(hour_start, '%H'), '%l:%i %p')),
  'revenue', JSON_ARRAYAGG(revenue),
  'orders', JSON_ARRAYAGG(sales)
) AS today
FROM combined;

     `,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    return dailyData;
  } catch (error) {
    console.log("Error getting daily data");
    throw error;
  }
};

module.exports = {
  getCardData,
  getUserPieData,
  getOrdersPieData,
  getEnrollDataPie,
  getSalesDataCountyWise,
  getInfluencerSales,
  getRecentOrders,
  getCouponUses,
  getPaymentWiseData,
  getVisitorsData,
  getMonthlyRevenuesAndOrders,
  getWeeklyRevenuesAndOrders,
  getDailyRevenuesAndOrders,
};
