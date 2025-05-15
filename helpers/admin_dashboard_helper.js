const e = require("express");
const { Sequelize } = require("../models");
const { generateLightColors } = require("../utils/color_generator");

const getCardData = async () => {
  try {
    const totalUsers = (await db.user.count()).toString();
    const totalOrders = (await db.payment.count()).toString();
    const totalVisitors = (await db.visitors.count()).toString();
    const totalSales = (await db.payment.sum("net_amount")).toFixed(2);

    return {
      totalUsers,
      totalOrders,
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

    console.log(coursesWithEnrollment);
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

module.exports = {
  getCardData,
  getUserPieData,
  getOrdersPieData,
  getEnrollDataPie,
  getSalesDataCountyWise,
};
